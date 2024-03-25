import * as yup from "yup";

const createUser = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.number().required().positive().integer(),
  password: yup.number().required().positive().integer(),
});

const addProperties = yup.object().shape({
  properties: yup.array().of(
    yup
      .object()
      .shape({
        square: yup.number().required().positive().integer().label("Manzana"),
        lot: yup.number().required().positive().integer().label("Lote"),
      })
      .required("Por favor elije una propiedad...")
  ),
});

const makePayment = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.number().required().positive().integer(),
  password: yup.number().required().positive().integer(),
});

export default () => <div>holo</div>;

export { createUser, addProperties, makePayment };
