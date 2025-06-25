import Button from '@/components/Button'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

export default function () {
  return (
    <>
      <div className="flex flex-col text-center  ">
        <div className="flex-1">
          <Image
            src="/square-logo.png"
            width={250}
            height={250}
            alt="Cumbre Siete, Altozano Tabasco. colonus.lat"
            style={{
              alignSelf: 'center',
              display: 'inline',
            }}
          />
          <p>Si eres propietario de Cumbre Siete, en este sitio podrás:</p>
        </div>
        <div className="flex-1 text-center">
          <List>
            <Item
            //@ts-ignore
            // checked
            >
              Controlar tus pagos
            </Item>
            <Item>Apartar areas comunes</Item>
            <Item>Hacer sugerencias o levantar alguna queja</Item>
          </List>
        </div>
      </div>
      <div className="text-center ">
        <Button href="/login" title="Ingresar" />
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
  background-image: url('./checked.png');
  background-repeat: no-repeat;
  background-position: ${(props) =>
    //@ts-ignore
    !props.checked ? '0px 0px' : '0px -30px'};
  background-size: 30px;
  height: 30px;
`
