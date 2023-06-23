import Layout from "@/components/layout/NLayout";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { VERIFY_PHONE, PHONE_VERIFIED } from "../login/queries.gql";

const Verify = () => {
  const isVerified = useQuery(PHONE_VERIFIED);
  const [veryfyPhone, { data, error, loading, called }] = useLazyQuery(
    VERIFY_PHONE,
    {
      onCompleted: (data) =>
        data?.verifyPhone
          ? setTimeout(() => window?.location?.reload(), 10000)
          : null,
    }
  );
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [focused, setFocus] = useState(0);
  const form = useRef(null);

  useEffect(() => {
    //@ts-ignore
    form.current[focused]?.focus();
    //@ts-ignore
    if (values.reduce((a, b) => parseInt(a) + parseInt(b), 0) > 0) {
      veryfyPhone({
        variables: {
          code: values.join(""),
        },
      });
    }
  }, [values]);

  useEffect(() => {
    if (called && !data?.isVerified) {
      setTimeout(() => {
        setValues(["", "", "", "", "", ""]);
        setFocus(0);
      }, 1000);
    }
  }, [called]);

  const clean = (index: number) => {
    const nextValues = [...values];
    nextValues[index] = "";
    setValues(nextValues);
    setFocus(index);
  };

  const setValue = (index: number, value: string) => {
    const nextValues = [...values];
    nextValues[index] = value;

    setValues(nextValues);
    setFocus(index + 1);
  };

  return (
    <Layout>
      <div className="w-full">
        <h1>
          Te enviamos un codigo por whatsapp para confirmar tu numero, por favor
          ingresa los 6 digitos.
        </h1>

        <form
          className={`flex flex-1 justify-between transition-opacity ${
            data?.verifyPhone ? "opacity-10" : ""
          }`}
          ref={form}
        >
          {values.map((v, i) => (
            <input
              key={i}
              value={v}
              type="text"
              maxLength={1}
              onChange={(e) => setValue(i, e.target.value)}
              onFocus={() => clean(i)}
              className="center m-2 block w-1/2 rounded-lg border-2 border-gray-300 bg-gray-50 p-3 text-gray-900 dark:border-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-xl"
            />
          ))}
        </form>
        {loading && <h2>Verificando telefono...</h2>}
        {data && data.verifyPhone && (
          <>
            <h2>Felicidades, hemos verificado tu telefono...</h2>
            <h3>Te redireccionaremos en 5 segundos</h3>
          </>
        )}
        {called && !data?.verifyPhone && (
          <p>El codigo es incorrecto, intenta de nuevo por favor</p>
        )}
      </div>
    </Layout>
  );
};

export default Verify;
