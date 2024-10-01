import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="bg-white">
      {/* <div className="navbar sticky top-0 bg-white text-black h-12 border-b shadow">
        <p className="text-base-regular tracking-wide px-2">
          <span className="font-medium mr-1">IMED Connect</span>| Privacy Policy
        </p>
      </div> */}

      <div className="max-w-3xl mx-auto my-32 px-4">
        <div className="w-full text-center mb-16">
          <p className="text-heading4-medium">Privacy Policy</p>
          <p>This Privacy Policy was last updated on March 4, 2024.</p>
        </div>
        <div className="flex flex-col space-y-2 text-small-regular">
          <p>
            Thank you for joining IMED Foundation. We at IMED Foundation (“IMED
            Foundation”, “we”, “us”) respect your privacy and want you to
            understand how we collect, use, and share data about you. This
            Privacy Policy covers our data collection practices and describes
            your rights regarding your personal data.
          </p>
          <p>
            Unless we link to a different policy or state otherwise, this
            Privacy Policy applies when you visit or use IMED Foundation
            websites, mobile applications, APIs, or related services (the
            “Services”). It also applies to prospective customers of our
            business and enterprise products.
          </p>
          <p>
            By using the Services, you agree to the terms of this Privacy
            Policy. You shouldn’t use the Services if you don’t agree with this
            Privacy Policy or any other agreement that governs your use of the
            Services.
          </p>
        </div>
        <div className="mt-4 text-small-regular">
          <ol class="list-decimal list-inside space-y-6">
            <li className="font-medium">
              What Data We Get{" "}
              <p className="font-normal">
                We collect certain data from you directly, like information you
                enter yourself, data about your consumption of content, and data
                from third-party platforms you connect with IMED Foundation. We
                also collect some data automatically, like information about
                your device and what parts of our Services you interact with or
                spend time using. All data listed in this section is subject to
                the following processing activities: collecting, recording,
                structuring, storing, altering, retrieving, encrypting,
                pseudonymizing, erasing, combining, and transmitting.
              </p>
              <p className="mt-4">1.1 Data You Provide to Us</p>
              <div className="w-full mt-2">
                <table className="table-auto border border-slate-200 w-full">
                  <thead className="border-b border-slate-200 text-small-regular">
                    <tr>
                      <th className="border-e border-slate-200 px-3 py-1.5 text-start">
                        Category
                      </th>
                      <th className="border-e border-slate-200 px-3 py-1.5 text-start">
                        Description
                      </th>
                      <th className=" px-3 py-1.5 text-start">
                        Legal Basis for Processing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-subtle-regular">
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Account data
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        To access content, users must create user and instructor
                        accounts, requiring email, password, and account
                        settings. Additional information may be required, and
                        unique identifiers assigned.
                      </td>
                      <td className="px-3 py-1.5">
                        <p>
                          The performance of the contract involves legitimate
                          interests such as service provisioning, identity
                          verification, fraud prevention and security, and
                          communication.
                        </p>
                      </td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Profile data
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        You can provide profile details like photo, biography,
                        language, website link, social media profiles, country,
                        or other data, which will be publicly viewable by
                        others.
                      </td>
                      <td className="px-3 py-1.5">
                        The performance of the contract involves legitimate
                        interests such as service provisioning, identity
                        verification, fraud prevention and security, and
                        communication.
                      </td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Shared content{" "}
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Services allow users to interact and share content
                        publicly, including uploading educational content,
                        posting reviews, asking questions, sending messages, and
                        uploading photos, which may be publicly viewable.{" "}
                      </td>
                      <td className="px-3 py-1.5">
                        The performance of the contract involves legitimate
                        interests such as service provisioning, identity
                        verification, fraud prevention and security, and
                        communication.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Learning data{" "}
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        We collect data on your access to content, including
                        course completions, completion certificates, exchanges
                        with instructors, and submissions for course
                        requirements.
                      </td>
                      <td className="px-3 py-1.5">
                        The performance of the contract involves legitimate
                        interests such as service provisioning, identity
                        verification, fraud prevention and security, and
                        communication.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Data About Your Accounts on Other Service{" "}
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        IMED Foundation may collect information from your social
                        media or online accounts connected to your IMED
                        Foundation account, based on your privacy settings and
                        third-party policies and agreements.{" "}
                      </td>
                      <td className="px-3 py-1.5">
                        Legitimate interests (identity verification, user
                        experience improvement)
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Sweepstakes, Promotions, and Survey{" "}
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        We may collect and store personal data for surveys or
                        promotions, subject to this Privacy Policy, for
                        administering the promotion or survey, notifying
                        winners, and distributing rewards.{" "}
                      </td>
                      <td className="px-3 py-1.5">
                        Performance of contract Legitimate interests (promotions
                        administration)
                      </td>
                    </tr>
                    <tr>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Communication and support{" "}
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        We collect and store your contact information, messages,
                        and other data for support and problem reporting,
                        ensuring compliance with our Privacy Policy.{" "}
                      </td>
                      <td className="px-3 py-1.5">
                        Legitimate interests (customer service and technical
                        support)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="font-normal mt-4">
                We may collect different data from or about you depending on how
                you use the Services. Below are some examples to help you better
                understand the data we collect. When you create an account and
                use the Services, including through a third-party platform, we
                collect any data you provide directly, including: The data
                listed above is stored by us and associated with your account.
              </p>
              <p className="mt-4">
                1.2 Data We Collect through Automated Means
              </p>
              <p className="font-normal mt-2">
                When you access the Services (including browsing content), we
                collect certain data by automated means, including:
              </p>
              <div className="w-full mt-2">
                <table className="table-auto border border-slate-200 w-full">
                  <thead className="border-b border-slate-200 text-small-regular">
                    <tr>
                      <th className="border-e border-slate-200 px-3 py-1.5 text-start">
                        Category
                      </th>
                      <th className="border-e border-slate-200 px-3 py-1.5 text-start">
                        Description
                      </th>
                      <th className=" px-3 py-1.5 text-start">
                        Legal Basis for Processing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-subtle-regular">
                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        System Data
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Technical data about your computer or device, including
                        IP address, device type, operating system, unique device
                        identifiers, browser, language, domain, and platform
                        types.
                      </td>
                      <td className="px-3 py-1.5">
                        <p>
                          Performance of contract Legitimate interests (service
                          provisioning, customer and technical support, fraud
                          prevention and security, communication, product
                          improvement)
                        </p>
                      </td>
                    </tr>

                    <tr className="border-b border-slate-200">
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Usage data{" "}
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        The Services collect usage statistics, including content
                        accessed, time spent, page visits, features used, search
                        queries, click data, date and time, and referrer.
                      </td>
                      <td className="px-3 py-1.5">
                        Legitimate interests (service provisioning, customer and
                        technical support, fraud prevention and security,
                        communication, product improvement)
                      </td>
                    </tr>

                    <tr>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        Approximate Geographic Data
                      </td>
                      <td className=" border-e border-neutral-200 px-3 py-1.5">
                        An approximate geographic location, including
                        information like city and geographic coordinates,
                        calculated based on your IP address.
                      </td>
                      <td className="px-3 py-1.5">
                        Legitimate interests (service provisioning, customer and
                        technical support, fraud prevention and security,
                        communication, product improvement)
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-1 font-normal">
                  The data listed above is collected through the use of server
                  log files and tracking technologies, as detailed in the
                  “Cookies and Data Collection Tools” section below. It is
                  stored by us and associated with your account.
                </p>
                <p className="mt-4">1.3 Data From Third Parties</p>
                <p className="mt-1 font-normal">
                  If you are a IMED Foundation Business enterprise or business
                  prospect, in addition to information you submit to us, we may
                  collect certain business contact information from third-party
                  commercial sources.
                </p>
              </div>
            </li>
            <li className="font-medium">
              How We Get Data About You
              <p className="font-normal">
                We use tools like cookies, web beacons, and similar tracking
                technologies to gather the data listed above. Some of these
                tools offer you the ability to opt out of data collection.
              </p>
              <p className="mt-4">2.1 Cookies and Data Collection Tools</p>
              <p className="mt-1 font-normal">
                We use cookies, which are small text files stored by your
                browser, to collect, store, and share data about your activities
                across websites, including on IMED Foundation. They allow us to
                remember things about your visits to IMED Foundation, like your
                preferred language, and to make the site easier to use.{" "}
              </p>
              <p className="mt-2 font-normal">
                IMED Foundation and service providers acting on our behalf use
                server log files and automated data collection tools like
                cookies, tags, scripts, customized links, device or browser
                fingerprints, and web beacons (together, “Data Collection
                Tools“) when you access and use the Services. These Data
                Collection Tools automatically track and collect certain System
                Data and Usage Data (as detailed in Section 1) when you use the
                Services. In some cases, we tie data gathered through those Data
                Collection Tools to other data that we collect as described in
                this Privacy Policy.
              </p>
              <p className="mt-4">2.2 Why We Use Data Collection Tools</p>
              <p className="mt-2 font-normal">
                IMED Foundation uses the following types of Data Collection
                Tools for the purposes described:
              </p>
              <ul className="mt-1 list-[lower-roman] list-outside ml-8 space-y-1 font-normal">
                <li>
                  Essential: Enables access to the site, provides basic
                  functionality, secures the site, protects against fraudulent
                  logins, and detects and prevents abuse or unauthorized use of
                  your account.
                </li>

                <li>
                  Functional: Remembers data about your browser and preferences,
                  provides additional site functionality, customizes content,
                  and remembers settings affecting the Services' appearance and
                  behavior.
                </li>
                <li>
                  Performance: Measures and improves the Services by providing
                  usage and performance data, visit counts, traffic sources, and
                  where an application was downloaded from.
                </li>
                <li>
                  Advertising: Delivers relevant ads based on user activity and
                  system data, and information provided by ad service providers.
                </li>
                <li>
                  Social Media: Enables social media functionality, tracks user
                  activity across other sites, and builds a profile of user
                  interests for targeted advertising.
                </li>
                <li>
                  Users can set their web browser to alert them about cookie
                  attempts, limit the types of cookies allowed, or refuse
                  cookies.
                </li>
              </ul>
              <p className="mt-4">2.3 Web Browser Controls for Cookies</p>
              <ul className="mt-1 list-[lower-roman] list-outside ml-8 space-y-1 font-normal">
                <li>Alerts users about cookie attempts.</li>
                <li>Limits cookie types.</li>

                <li>Rejects cookies entirely.</li>
                <li>May affect Service features and functionality.</li>
              </ul>
            </li>
            <li className="font-medium">
              Data Usage and Services Overview
              <ul className="list-disc list-outside space-y-2 mt-1 ml-8">
                <li>
                  Provide and administer Services: Facilitates participation in
                  educational content, issue completion certificates, displays
                  customized content, and facilitates communication with other
                  users.
                </li>
                <li>
                  Process requests and orders for educational content, products,
                  specific services, information, or features: Account Data,
                  Shared Content, Learning Data, System Data, Communications and
                  Support.
                </li>
                <li>
                  Communicate with users about their account: Responds to
                  questions and concerns, sends administrative messages, and
                  sends push notifications.
                </li>
                <li>
                  Manage account preferences and personalize experience: Manages
                  account and account preferences.
                </li>
                <li>
                  Facilitate technical functioning of Services: Troubleshoots
                  and resolves issues, secures Services, and prevents fraud and
                  abuse.
                </li>
                <li>
                  Solicit user feedback: Account Data; Communications and
                  Support.
                </li>
                <li>
                  Market products, services, surveys, and promotions: Account
                  Data; Learning Data; Sweepstakes, Promotions, and Surveys;
                  Usage Data; Cookie Data.
                </li>
                <li>
                  Learn more about users: Linking data with additional data
                  through third-party data providers and analytics service
                  providers.
                </li>
                <li>
                  Identify unique users across devices: Account Data; System
                  Data; Cookie Data.
                </li>
                <li>
                  Improve Services: Improve Services and develop new products,
                  services, and features.
                </li>
                <li>Analyze trends and traffic: Track usage data.</li>
                <li>
                  Advertise Services on third-party websites and applications:
                  Account Data; Cookie Data.
                </li>
              </ul>
            </li>
            <li className="font-medium">
              Data Sharing with Third Parties
              <ul className="list-[lower-alpha] list-outside space-y-2 mt-1 ml-8">
                <li>
                  Instructors: Your data is shared with instructors or teaching
                  assistants for educational content improvement.
                </li>
                <li>
                  Other Students and Instructors: Your shared content and
                  profile data may be publicly viewable.
                </li>
                <li>
                  Service Providers, Contractors, and Agents: Your data is
                  shared with third-party companies performing services on our
                  behalf.
                </li>
                <li>
                  IMED Foundation Affiliates: Your data may be shared within our
                  corporate family of companies related by common ownership or
                  control.
                </li>
                <li>
                  Business Partners: Your data may be shared with other websites
                  and platforms to distribute our Services and drive traffic to
                  IMED Foundation.
                </li>
                <li>
                  Analytics and Data Enrichment Services: We share certain
                  contact information or deidentified data as part of our use of
                  third-party analytics tools like Google Analytics and data
                  enrichment services like ZoomInfo.
                </li>
                <li>
                  To Power Social Media Features: Your interactions with these
                  features are governed by the third-party company’s privacy
                  policy.
                </li>

                <li>
                  To Administer Promotions and Surveys: Your data may be shared
                  as necessary to administer, market, or sponsor promotions and
                  surveys you choose to participate in.
                </li>
                <li>
                  For Advertising: If we decide to use an advertising-supported
                  revenue model in the future, we may use and share certain
                  System Data and Usage Data with third-party advertisers and
                  networks to show general demographic and preference
                  information among our users.
                </li>
                <li>
                  For Security and Legal Compliance: We may disclose your data
                  to third parties if we have a good faith belief that the
                  disclosure is requested as part of a judicial, governmental,
                  or legal inquiry, reasonable necessary to enforce our Terms of
                  Use, Privacy Policy, and other legal agreements, required to
                  detect, prevent, or address fraud, abuse, misuse, potential
                  violations of law, or to protect against imminent harm to the
                  rights, property, or safety of IMED Foundation, our users,
                  employees, members of the public, or our Services.
                </li>
                <li>
                  During a Change in Control: If IMED Foundation undergoes a
                  business transaction like a merger, acquisition, corporate
                  divestiture, or dissolution, we may share, disclose, or
                  transfer all of your data to the successor organization during
                  such transition or in contemplation of a transition.
                </li>
                <li>
                  After Aggregation/ DE-identification: We may disclose or use
                  aggregated or de-identified data for any purpose.
                </li>
              </ul>
            </li>
            <li className="font-medium">
              IMED Foundation's Security Measures
              <ul className="font-normal list-[circle] list-outside ml-2 mt-1 ml-8">
                <li>
                  Uses appropriate security based on data type and sensitivity.
                </li>
                <li>
                  Protects against unauthorized access, alteration, disclosure,
                  or destruction of personal data.
                </li>
                <li>Measures vary based on data type and sensitivity.</li>
                <li>
                  No system can be 100% secure, so communications cannot be free
                  from unauthorized access.
                </li>
                <li>
                  Password is an important part of the security system, and
                  users should protect it.
                </li>
                <li>
                  If password or account is compromised, change it immediately
                  and contact the Support Team.
                </li>
              </ul>
            </li>
            <li className="font-medium">
              Data Rights Overview
              <p className="font-normal">
                Opt-out of promotional emails, cookies, and third-party data
                collection. Account updates and termination within Services.
                Individual rights requests for personal data.
              </p>
              <div className="">
                <p className="mt-1.5">6.1 Data Usage Choices</p>
                <p className="font-normal">
                  Users can opt out of certain data usage but may not be able to
                  use certain Services features. To stop receiving promotional
                  communications, users can use the unsubscribe mechanism or
                  change their email preferences. Users can control cookies and
                  other local data storage through their browser or device.
                  Users can control cookies used for tailored advertising from
                  participating companies. Users can opt out of Google
                  Analytics, from using their data for analytic or enrichment.
                  For questions about data, its use, or rights, users can
                  contact info@imedfoundation.or.tz
                </p>
                <p className="mt-1.5">
                  6.2 IMED Foundation's Personal Data Access, Updating, and
                  Deleting Policy
                </p>
                <p className="font-normal">
                  Users can access and update their personal data by logging
                  into their account. To terminate an account, students can
                  visit their profile settings page. Instructors can follow the
                  same steps. If issues arise, contact the Support Team. Data
                  may still be visible even after account termination. Retention
                  of data is necessary for legal obligations, dispute
                  resolution, and agreement enforcement. Requests for access,
                  correction, or deletion can be made online, by email, or by
                  writing to IMED Foundation. Certain data may be retained for
                  mandatory record-keeping and transaction completion.
                </p>
              </div>
            </li>
            <li className="font-medium">
              Privacy Policy Updates and Contact Information
              <p className="font-normal mt-1">
                IMED Foundation updates this policy via email, in-product
                notice, or other legal mechanisms. Changes become effective the
                day they are posted. Users can contact IMED Foundation via email
                or postal mail for any questions, concerns, or disputes.
                Modifications to this policy may occur periodically, with
                notification via email or posted on the Services. Continued use
                of the Services after a change signifies acceptance of the
                revised Privacy Policy. Capitalized terms not defined in this
                policy are defined in IMED Foundation's Terms of Use. Questions,
                concerns, or disputes can be addressed via postal mail (P.O.Box
                35036) or to our email address info@imedfoundation.or.tz
                Located: Sam Nujoma Road,Opp Mlimani City, 8rd Floor,Mlimani
                tower.
              </p>
            </li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-black text-base-content">
        <aside>
          <p className=" text-slate-400">
            Copyright © 2024 - All right reserved by IMED
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default page;
