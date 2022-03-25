import {
  Arg, Mutation, Resolver,
} from 'type-graphql';
import { User } from '../../../entity/User';
import { createRestorePasswordUrl } from '../../../utils/createUrl';
import { EmailBodies, EmailSubjects } from '../../../constants/EmailConstants';
import { sendMail } from '../../../utils/sendMail';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    user.token_version += 1;
    user.verified = null;
    await user.save();

    const url = await createRestorePasswordUrl(user.email);
    const emailBody = EmailBodies.RESTORE_PASSWORD.replace(/%link%/g, url);

    await sendMail(user.email, EmailSubjects.RESTORE_PASSWORD, emailBody);

    return true;
  }
}
