import { buildSchema } from 'type-graphql';
import { RegisterResolver } from '../modules/user/register/RegisterResolver';
import { LoginResolver } from '../modules/user/login/LoginResolver';
import { HealthResolver } from '../modules/info/health/HealthResolver';
import { CurrentUserResolver } from '../modules/user/currentUser/CurrentUserResolver';
import { ConfirmResolver } from '../modules/user/confirm/ConfirmResolver';
import { RestorePasswordResolver } from '../modules/user/restorePassword/RestorePasswordResolver';
import { ForgotPasswordResolver } from '../modules/user/forgotPassword/ForgotPasswordResolver';
import { RefreshResolver } from '../modules/user/login/RefreshResolver';
import { CreateOfferResolver } from '../modules/offsers/create/CreateOfferResolver';
import { UpdateOfferResolver } from '../modules/offsers/update/UpdateOfferResolver';
import { OneOfferResolver } from '../modules/offsers/get/OneOfferResolver';
import { ListOfferResolver } from '../modules/offsers/get/ListOfferResolver';
import { BreakdownResolver } from '../modules/analytics/breakdown/BreakdownResolver';
import { ReportResolver } from '../modules/analytics/reports/ReportResolver';
import { DeleteOfferResolver } from '../modules/offsers/delete/DeleteOfferResolver';
import { ExistsResolver } from '../modules/user/exists/ExistsResolver';
import { GetVerticalsResolver } from '../modules/info/verticals/GetVerticalsResolver';
import { GetCurrenciesResolver } from '../modules/info/currencies/GetCurrenciesResolver';
import { GetToken } from '../modules/info/postback/GetToken';

export const createSchema = () => buildSchema({
  resolvers: [
    UpdateOfferResolver,
    HealthResolver,
    RegisterResolver,
    LoginResolver,
    RefreshResolver,
    CurrentUserResolver,
    ConfirmResolver,
    RestorePasswordResolver,
    ForgotPasswordResolver,
    CreateOfferResolver,
    OneOfferResolver,
    ListOfferResolver,
    BreakdownResolver,
    ReportResolver,
    DeleteOfferResolver,
    ExistsResolver,
    GetVerticalsResolver,
    GetCurrenciesResolver,
    GetToken,
  ],
  emitSchemaFile: true,
});
