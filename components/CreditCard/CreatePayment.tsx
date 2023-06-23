import { useCallback } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { memo } from "react";
import axios from "axios";

const CreatePayments = (props) => {
  const { user, amount } = props;
  const settings = {
    initialization: {
      customization: {
        paymentMethods: {
          minInstallments: 1,
          maxInstallments: 1,
        },
      },
      payer: {
        email: user?.email,
      },
      amount, //value of the payment to be processed
    },
    callbacks: {
      onSubmit: async (body) => {
        await axios.post("/mp_payment", {
          body,
        });
        console.log("cardFormData", cardFormData);
      },
      onReady: () => {
        // handle form ready
      },
      onError: (error) => {
        // handle error
      },
    },
  };

  const loadBricks = useCallback(async () => {
    await loadMercadoPago();
    const mp = new window.MercadoPago(
      "TEST-ff165bc7-7fc1-4250-8247-71bc9a68c05c",
      { locale: "es" }
    );
    console.log(">>", mp.bricks());

    mp.bricks().create("cardPayment", "cardPaymentBrick_container", settings);
  }, [amount]);
  loadBricks();
  return (
    <>
      <div id="cardPaymentBrick_container"></div>
    </>
  );
};

export default memo(CreatePayments);
