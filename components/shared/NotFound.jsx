import React from "react";

const NotFound = () => {
  return (
    <section className="bg-white w-full rounded-lg">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-4 text-heading3-bold font-bold text-black">
            Not Found
          </p>
          <p className="mb-4 text-small-regular font-light text-black tracking-wide">
            We searched high and low, but couldn’t find what you’re looking for.
            Let’s find a better place for you to go.
          </p>
          <a
            href="/"
            className="inline-flex text-white bg-primary-500 font-medium rounded-md text-small-regular px-8 py-2.5 text-center my-4"
          >
            Return Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
