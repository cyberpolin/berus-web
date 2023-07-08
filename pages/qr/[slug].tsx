import Button from "@/components/Button"
import Image from "next/image"
import styled from "styled-components"
import { QRCode } from "react-qr-svg"
import { useRouter } from "next/router"

export default function () {
  const {
    query: { slug },
  } = useRouter()

  return (
    <>
      <div className="flex flex-col text-center  ">
        <div className="flex-1">
          <Image
            src="/square-logo.png"
            width={250}
            height={250}
            alt="Cumbre Siete, Altozano Tabasco"
            style={{
              alignSelf: "center",
              display: "inline",
            }}
          />
          <p>
            Te han invitado a Cumbre 7 en Altozano tabasco, por favor muestra
            este QR en caseta para que te den acceso...
          </p>
          <QRCode
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            className="center mx-auto my-8 w-1/2"
            value={slug}
          />
          <p>
            Por favor recuerda que el limite de velocidad es de 20km/hr, te
            agradecemos tu ayuda...
          </p>
        </div>
      </div>
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  text-align: center;
  padding: 10% !important;
  flex-direction: column;
  width: 100%;
`

const List = styled.ul`
  text-align: left;
  align-self: center;
`

const Item = styled.li`
  margin: 20px;
  padding: 5px 0 10px 50px;
  list-style: none;
  background-image: url("./checked.png");
  background-repeat: no-repeat;
  background-position: ${(props) =>
    //@ts-ignore
    !props.checked ? "0px 0px" : "0px -30px"};
  background-size: 30px;
  height: 30px;
`
