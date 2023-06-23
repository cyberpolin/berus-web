import NLayout from "@/components/layout/NLayout";

import CreatePayments from "@/components/CreditCard/CreatePayment";

const Payment = () => {
  console.log("payments");
  return (
    <NLayout>
      <CreatePayments amount={1220} user={{ email: "cyberpolin@gmail.com" }} />
    </NLayout>
  );
};

export default Payment;
