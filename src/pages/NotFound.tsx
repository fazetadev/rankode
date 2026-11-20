import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card padding="lg" className="max-w-md text-center">
        <p className="font-mono text-sm font-semibold text-[#8B5CF6]">404</p>
        <h1 className="mt-2 text-lg font-semibold text-[#FAFAFA]">Página no encontrada</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          La ruta solicitada no existe o fue movida dentro de la plataforma.
        </p>
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </Card>
    </div>
  );
}
