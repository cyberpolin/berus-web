import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

export default function () {
  return (
    <Wrapper>
      <h1>Bienvenido!</h1>
      <Image
        src="/square-logo.png"
        width={250}
        height={250}
        style={{
          alignSelf: "center",
        }}
      />
      <p>Si eres propietario de Cumbre Siete, en este sitio podrás:</p>
      <List>
        <Item>Controlar tus pagos</Item>
        <Item>Apartar areas comunes</Item>
        <Item>Hacer sugerencias o levantar alguna queja</Item>
      </List>
      <Button href="/login" className="button-Primary">
        Ingresar
      </Button>
    </Wrapper>
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
