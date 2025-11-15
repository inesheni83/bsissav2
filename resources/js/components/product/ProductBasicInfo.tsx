import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { ProductFormData, ProductFormErrors } from '@/types/product';

interface ProductBasicInfoProps {
  data: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function ProductBasicInfo({ data, errors, onChange }: ProductBasicInfoProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {/* Nom du produit */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nom du produit
          </Label>
          <Input
            id="name"
            name="name"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ex: Bsissa Premium"
            required
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.name} />
        </div>

        {/* Prix */}
        <div className="space-y-3">
          <Label htmlFor="price" className="text-sm font-medium text-foreground">
            Prix (€)
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={data.price}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder="29.99"
            required
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.price} />
        </div>

        {/* Poids */}
        <div className="space-y-3">
          <Label htmlFor="weight_kg" className="text-sm font-medium text-foreground">
            Poids (kg)
          </Label>
          <Input
            id="weight_kg"
            name="weight_kg"
            type="number"
            step="0.001"
            min="0"
            value={data.weight_kg}
            onChange={(e) => onChange('weight_kg', e.target.value)}
            placeholder="0.500"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.weight_kg} />
        </div>

        {/* Stock */}
        <div className="space-y-3">
          <Label htmlFor="stock_quantity" className="text-sm font-medium text-foreground">
            Stock
          </Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            value={data.stock_quantity}
            onChange={(e) => onChange('stock_quantity', e.target.value)}
            placeholder="100"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.stock_quantity} />
        </div>
      </div>
    </section>
  );
}
