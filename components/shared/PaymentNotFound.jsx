import React from "react";

const PaymentNotFound = () => {
  return (
    <section className="bg-white border w-full rounded-lg">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <p className="mb-4 text-heading3-bold font-bold text-black">
            Oooh, Pole!
          </p>
          <p className="mb-4 text-small-regular font-light text-black">
            Malipo hayapatikani kwa sasa
            <br />
            Tafadhali jaribu badae, kwa sasa kuna marekebisho ya kiufundi
            yanaendelea, hivyo huduma ya malipo imesitishwa kwa muda. Huduma hii
            itarejea hivi punde
          </p>
          <a
            href="/"
            className="inline-flex text-white bg-primary-dark-blue font-medium rounded-lg text-small-regular px-6 py-2 text-center  my-4"
          >
            Rudi Nyumbani
          </a>
        </div>
      </div>
    </section>
  );
};

export default PaymentNotFound;
