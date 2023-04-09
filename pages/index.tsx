import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

export default function () {
  return (
    <>
      <div className="flex flex-col text-center  md:flex-row ">
        <div className="flex-1">
          <h1>Bienvenido!</h1>
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
          <p>Si eres propietario de Cumbre Siete, en este sitio podrás:</p>
        </div>
        <div className="flex-1 text-center">
          <List>
            <Item>Controlar tus pagos</Item>
            <Item>Apartar areas comunes</Item>
            <Item>Hacer sugerencias o levantar alguna queja</Item>
          </List>
        </div>
      </div>
      <div className="text-center ">
        <Button href="/login" className="">
          Ingresar
        </Button>
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
  margin: 0;
  padding: 10px 0 10px 30px;
  list-style: none;
  background-image: url("./checked.png");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 20px;
`

const Button = styled(Link)`
  background-color: #234432;
  border-radius: 5px;
  padding: 10px 20px;
  color: white;
  text-decoration: none;
  margin: 0 auto;
`
