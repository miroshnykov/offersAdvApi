import { Arg, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';
import { getManager } from 'typeorm';
import { User } from '../../../entity/User';
import { UserStatus } from '../../../constants/UserStatus';
import { RegisterInput } from './RegisterInput';
import { sendMail } from '../../../utils/sendMail';
import { EmailBodies, EmailSubjects } from '../../../constants/EmailConstants';
import { createConfirmationUrl } from '../../../utils/createUrl';
import { Logger } from '@milkbox/common-components-backend';
import { AdvertiserInformation } from '../../../entity/AdvertiserInformation';

const log = Logger(module);

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg('data') data: RegisterInput,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = User.create();
    user.name = `${data.profileData.firstName} ${data.profileData.lastName}`;
    user.email = data.email;
    user.password = hashedPassword;
    user.status = UserStatus.PENDING;
    user.date_added = Date.now() / 1000;
    user.descriptions = '';
    user.advertiser_manager_id = 0;
    user.origin_id = 0;
    user.website = '';
    user.tags = '';

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        // save user
        const advertiser = await transactionalEntityManager.save(user);
        log.debug(data.profileData.websites);
        // save profile information
        const advertiserInformation = new AdvertiserInformation();
        advertiserInformation.advertiser_id = advertiser.id;
        advertiserInformation.first_name = data.profileData.firstName;
        advertiserInformation.last_name = data.profileData.lastName;
        advertiserInformation.business_name = data.profileData.businessName;
        advertiserInformation.other_networks = JSON.stringify(data.profileData.otherNetworks);
        advertiserInformation.top_countries = data.profileData.topCountries;
        advertiserInformation.offered_products = data.profileData.offeredProducts;
        advertiserInformation.websites = JSON.stringify(data.profileData.websites);
        await transactionalEntityManager.save(advertiserInformation);
      });

      const url = await createConfirmationUrl(user.email);
      const emailBody = EmailBodies.VERIFY_EMAIL.replace(/%link%/g, url);

      await sendMail(user.email, EmailSubjects.VERIFY_EMAIL, emailBody);

      return user;
    } catch (error: any) {
      log.error(error.message, error.stack);
      throw error;
    }
  }
}
