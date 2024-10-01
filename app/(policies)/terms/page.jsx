import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="bg-white">
      <div className="navbar  bg-white sticky top-0 shadow-md text-black">
        <div className="flex-1">
          <a className="btn btn-ghost text-body-bold lg:text-heading4-medium">
            Terms Of Service
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div className="flex flex-col max-w-3xl px-6 lg:px-0 mx-auto mt-32 text-black">
          <Image
            src="/assets/document-pana.svg"
            className=" h-48 lg:h-80"
            alt="image"
            height={1920}
            width={1920}
          />
          {/* Introduction */}
          <p className="mt-10 text-body-bold">Introduction</p>
          <p className="mt-2 text-base-regular">
            We know it’s tempting to skip these Terms of Service, but it’s
            important to establish what you can expect from us as you use
            Utelezi services, and what utelezi expect from you.
          </p>

          <p className="mt-2">
            These Terms of Service reflect the way that Utelezi works, the laws
            that apply to our company, and certain things that we’ve always
            believed to be true. As a result, these Terms of Service help define
            Utelezi’s relationship with you as you interact with utelezi
            services.
          </p>

          <p className="mt-2">
            “Personal Data” refers to any information associated with an
            identified or identifiable individual, which can include data that
            you provide to us, and we collect about you during your interaction
            with our Services.
          </p>
          <p className="mt-2">
            “Service” refer to the products and services provided by Utelezi.
            This include utelezi.cc and other associated services provided by
            Utelezi.
          </p>

          <div className="mt-32">
            <Image
              src="/assets/thesis-bro.svg"
              className=" h-48 lg:h-80"
              alt="image"
              height={1920}
              width={1920}
            />
          </div>

          {/* Your Information */}
          <p className="mt-10 text-body-bold">Using Utelezi services</p>
          <p className="mt-2">
            If you are above 18 years of age, you can create an Utelezi Account
            for your convenience. Some services require that you have an account
            created in order to work – for example, to see list of users, you
            need an Account.
          </p>
          <p className="mt-2 mb-32">
            If you think that someone is impersonating you, you can send us
            notice of the infringement and we’ll take appropriate action. For
            example, we suspend or close the Utelezi Accounts of repeated
            impersonation.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-black text-base-content">
        <aside>
          <p className=" text-slate-400">
            Copyright © 2024 - All right reserved by Utelezi
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default page;
