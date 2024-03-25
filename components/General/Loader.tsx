import { LoaderType } from "@/lib/types";

const Loader = ({ error, loading, errorTitle, errorMessage }: LoaderType) => {
  if (error) {
    return (
      <div
        className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <span className="font-medium">{errorTitle || "Algo salio mal!"}</span>
        {errorMessage || "Por favor intente de nuevo mas tarde..."}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-gray-800 dark:text-blue-400"
        role="alert"
      >
        <span className="font-medium">Info alert!</span> Cargando...
      </div>
    );
  }

  return <></>;
};

export default Loader;
