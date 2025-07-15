import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_USER,
  CREATE_USER,
  UPDATE_USER_ADMIN,
  GET_OVERDUE_PROPERTIES,
} from '../adminQueries.gql'
import Layout from '@/components/layout/NLayout'

const UserForm = () => {
  const router = useRouter()
  const { id } = router.query
  const isEditMode = id !== 'new'
  console.log('isEditMode', isEditMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false,
    isSecurity: false,
    isProvider: false,
    providerType: '',
    needsBill: false,
    isVerified: false,
    rfc: null,
    properties: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { loading: queryLoading } = useQuery(GET_USER, {
    variables: { id },
    skip: !isEditMode,
    onCompleted: (data) => {
      if (data?.user) {
        const { properties, rfc, ...userData } = data.user
        setFormData({
          ...userData,
          password: '',
          properties: properties?.map((p) => p.id) || [],
          rfc: rfc?.publicId || null,
        })
      }
    },
    onError: (err) => {
      setError('Error al cargar los datos del usuario')
      console.error(err)
    },
  })

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      router.back()
    },
    onError: (err) => {
      setError(err.message)
      setIsSubmitting(false)
    },
  })

  const [updateUser] = useMutation(UPDATE_USER_ADMIN, {
    onCompleted: () => {
      router.back()
    },
    onError: (err) => {
      setError(err.message)
      setIsSubmitting(false)
    },
    refetchQueries: [GET_OVERDUE_PROPERTIES],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (isEditMode) {
        await updateUser({
          variables: {
            id,
            data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              isAdmin: formData.isAdmin,
              isSecurity: formData.isSecurity,
              isProvider: formData.isProvider,
              isVerified: formData.isVerified,
              needsBill: formData.needsBill,
            },
          },
        })
      } else {
        await createUser({
          variables: {
            data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              isAdmin: formData.isAdmin,
              isSecurity: formData.isSecurity,
              isProvider: formData.isProvider,
              isVerified: formData.isVerified,
              needsBill: formData.needsBill,
            },
          },
        })
      }
    } catch (err) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  if (queryLoading) return <div>Cargando...</div>

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4">
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h2>
                <h3 className="border-b pb-2 text-lg font-semibold">
                  Información Básica
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                    required
                  />
                </div>

                {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isEditMode ? 'Nueva Contraseña' : 'Contraseña*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  minLength="4"
                  required={!isEditMode}
                />
              </div> */}
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold">
                  Roles y Permisos
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Administrador
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isSecurity"
                      checked={formData.isSecurity}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Seguridad
                    </span>
                  </label>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isProvider"
                        checked={formData.isProvider}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Proveedor
                      </span>
                    </label>

                    {formData.isProvider && (
                      <select
                        name="providerType"
                        value={formData.providerType}
                        onChange={handleChange}
                        className="ml-2 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                      >
                        <option value="">Selecciona tipo</option>
                        <option value="Pool">Alberca</option>
                        <option value="Security">Seguridad</option>
                        <option value="Gardener">Jardinería</option>
                        <option value="Garbage">Basura</option>
                        <option value="Others">Otros</option>
                      </select>
                    )}
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="needsBill"
                      checked={formData.needsBill}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Requiere factura
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Verificado
                    </span>
                  </label>
                </div>

                {/* <div>
                <label className="block text-sm font-medium text-gray-700">RFC (Imagen)</label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img src={imagePreview} alt="RFC Preview" className="h-16 w-16 rounded object-cover" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        <span>Subir Imagen</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const file = e.target.files[0]
                              // Aquí implementarías la lógica de subida a Cloudinary
                              // y llamarías a handleImageUpload con la respuesta
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div> */}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                  isSubmitting
                    ? 'bg-green-400'
                    : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : isEditMode ? (
                  'Actualizar Usuario'
                ) : (
                  'Crear Usuario'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default UserForm
