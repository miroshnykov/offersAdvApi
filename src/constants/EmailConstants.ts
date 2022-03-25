import { Offer } from '../entity/Offer';
import { User } from '../entity/User';
import { Vertical } from '../entity/Vertical';
import { OfferCap } from '../entity/OfferCap';
import { Landing } from '../entity/Landing';
import { OfferGeo } from '../entity/OfferGeo';
import { CustomLanding } from '../entity/CustomLanding';
import { OfferCustomPayin } from '../entity/OfferCustomPayin';

export const EmailSubjects = {
  VERIFY_EMAIL: 'Welcome aboard Ad-Firm!',
  RESTORE_PASSWORD: 'Reset your Ad-Firm password',
  OFFER_UPDATED: 'It\'s all in the subject!',
  OFFER_DELETED: 'Intentional or mistake?',
};

export const EmailBodies = {
  VERIFY_EMAIL: `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${EmailSubjects.VERIFY_EMAIL}</title>
        <style></style>
      </head>
      <body>
        <h3>Thank you for joining the Firm!</h3>
        <p>To confirm your email address and finish your registration, please click on <a target="_blank" href="%link%">%link%</a></p>
      </body>
    </html>`,
  RESTORE_PASSWORD: `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${EmailSubjects.RESTORE_PASSWORD}</title>
        <style></style>
      </head>
      <body>
        <h3>${EmailSubjects.RESTORE_PASSWORD}</h3>
        <p>You just need to follow this link and you will be able to change your password: <a target="_blank" href="%link%">%link%</a></p>
        <p>Come back quick, we got great work ahead of us!</p>
      </body>
    </html>`,
  OFFER_UPDATED: `
    <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>${EmailSubjects.OFFER_UPDATED}</title>
          <style></style>
        </head>
        <body>
          <h3>${EmailSubjects.OFFER_UPDATED}</h3>
          <p>Go to BackOffice > Advertisers > Offers and check the "History" tab to see what changed</p>
        </body>
      </html>`,
  OFFER_DELETED: `
    <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>${EmailSubjects.OFFER_DELETED}</title>
          <style></style>
        </head>
        <body>
          <h3>${EmailSubjects.OFFER_DELETED}</h3>
          <p></p>
        </body>
      </html>`,
};

type OfferDeletedData = {
  verticals: Vertical[] | undefined,
  landings: Landing[] | undefined,
  offer: Offer,
  advertiser: User,
  cap: OfferCap | undefined,
  customLanding: CustomLanding | undefined,
  geo: OfferGeo | undefined,
  customPayin: OfferCustomPayin[] | undefined,
}

export const OfferDeleted = (data: OfferDeletedData) => {
  const templateData = {
    vertical: '',
    landings: '',
    payIn: `<li>Default: ${data.offer.payin}</li>`,
    geo: '',
    cap_start_date: '',
    cap_end_date: '',
    start_date: '',
    end_date: '',
    date: '',
    cap_date: '',
  }

  if (data.verticals) {
    templateData.vertical = data.verticals.find((v) => v.id === data.offer.sfl_vertical_id)!.name;
  }
  if (data.landings) {
    data.landings.forEach((lp) => {
      if (data.offer.sfl_offer_landing_page_id === lp.id) {
        templateData.landings += `<li>${lp.name}: ${lp.url} (default)</li>`
      }
    });
  }
  if (data.customLanding) {
    const rules = JSON.parse(data.customLanding.rules);
    rules.customLPRules.forEach((lp: any) => {
      templateData.landings += `<li>${lp.lpName}: ${lp.lpUrl} (GEO: ${lp.country})</li>`;
    });
  }
  if (data.customPayin) {
    data.customPayin.forEach((customPayin) => {
      templateData.payIn += `<li>${customPayin.geo}: ${customPayin.payin}</li>`
    });
  }
  if (data.geo) {
    const json = JSON.parse(data.geo.rules) as any;
    json.geo.forEach((ban: any) => {
      templateData.geo += `<li>${ban.country}</li>`;
    });
  }
  if (data.cap && data.cap.use_start_end_date) {
    if (data.cap.start_date) {
      templateData.cap_start_date = `${data.cap.start_date.getFullYear()}-${data.cap.start_date.getMonth()}-${data.cap.start_date.getDate()}`;
    }
    if (data.cap.end_date) {
      templateData.cap_end_date = `${data.cap.end_date.getFullYear()}-${data.cap.end_date.getMonth()}-${data.cap.end_date.getDate()}`;
    }
  }
  if (data.offer.start_date) {
    templateData.start_date = `${data.offer.start_date.getFullYear()}-${data.offer.start_date.getMonth()}-${data.offer.start_date.getDate()}`;
  }
  if (data.offer.end_date) {
    templateData.end_date = `${data.offer.end_date.getFullYear()}-${data.offer.end_date.getMonth()}-${data.offer.end_date.getDate()}`;
  }

  if (templateData.cap_start_date || templateData.cap_start_date) {
    if (templateData.cap_start_date) {
      templateData.cap_date = `Active Date Range: ${templateData.cap_start_date}`;
      if (templateData.cap_end_date) {
        templateData.cap_date += ` - ${templateData.cap_end_date}`;
      }
    }
  }
  if (templateData.start_date || templateData.start_date) {
    if (templateData.start_date) {
      templateData.date = `Date: ${templateData.start_date}`;
      if (templateData.end_date) {
        templateData.date += ` - ${templateData.end_date}`;
      }
    }
  }

  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${EmailSubjects.OFFER_DELETED}</title>
        <style></style>
      </head>
      <body>
        <h3>Intentional or mistake?</h3>
        <p>${data.advertiser.name} has deleted the offer ${data.offer.name} and just in case, you can find the details here:
          <ul>
            <li>Vertical: ${templateData.vertical}</li>
            <li>Conversion Flow Type: ${data.offer.conversion_type.toUpperCase()}</li>
            <li>Landing Pages
              <ul>
                ${templateData.landings}
              </ul>
            </li>
            <li>Price
              <ul>
                ${templateData.payIn}
              </ul>
            </li>
            <li>Banned Countries
              <ul>
                ${templateData.geo}
              </ul>
            </li>
            <li>Caps
              <ul>
                <li>Clicks
                  <ul>
                    <li>Daily: ${data.cap ? data.cap.clicks_day : 0}</li>
                    <li>Weekly: ${data.cap ? data.cap.clicks_week : 0}</li>
                    <li>Monthly: ${data.cap ? data.cap.clicks_month : 0}</li>
                  </ul>
                </li>
                <li>Conversions
                  <ul>
                    <li>Daily: ${data.cap ? data.cap.sales_day : 0}</li>
                    <li>Weekly: ${data.cap ? data.cap.sales_week : 0}</li>
                    <li>Monthly: ${data.cap ? data.cap.sales_month : 0}</li>
                  </ul>
                </li>
                <li>${templateData.cap_date}</li>
              </ul>
            </li>
            <li>${templateData.date}</li>
          </ul>
        </p>
      </body>
    </html>
  `;
}
