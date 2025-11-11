import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TestDbPage() {
  const supabase = createClient()
  
  // Attempt to fetch the first product from the 'products' table
  const { data, error } = await supabase.from('products').select('*').limit(1)

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Prueba de Conexión a Supabase</CardTitle>
          <CardDescription>
            Intentando leer el primer registro de la tabla `products`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div>
              <h3 className="font-bold text-red-500">Error en la consulta:</h3>
              <p className="mt-2 text-sm bg-red-100 p-2 rounded">
                {error.message}
              </p>
              <p className="mt-4 text-xs">
                <b>Nota:</b> Si el error indica que la tabla `products` no existe (`relation "products" does not exist`), la conexión <b>SÍ</b> está funcionando. Simplemente la tabla aún no ha sido creada en tu base de datos.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-green-500">¡Conexión y Consulta Exitosas!</h3>
              <p className="mt-2 text-sm">Se obtuvo una respuesta de la tabla `products`.</p>
              <div className="mt-2 font-mono text-xs bg-gray-100 p-3 rounded">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


