import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { ProductFormData, ProductFormErrors } from '@/types/product';

interface ProductDescriptionsProps {
  data: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function ProductDescriptions({ data, errors, onChange }: ProductDescriptionsProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {/* Description */}
        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Décrivez votre produit..."
            rows={6}
            className="w-full rounded-xl border border-beige-200 px-4 py-3 shadow-sm focus:border-pistachio-400 focus:ring-pistachio-400/20 resize-none"
          />
          <InputError message={errors.description} />
        </div>

        {/* Ingrédients */}
        <div className="space-y-3">
          <Label htmlFor="ingredients" className="text-sm font-medium text-foreground">
            Ingrédients
          </Label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={data.ingredients}
            onChange={(e) => onChange('ingredients', e.target.value)}
            placeholder="Liste des ingrédients (farine, eau, sel, etc.)"
            rows={6}
            className="w-full rounded-xl border border-beige-200 px-4 py-3 shadow-sm focus:border-pistachio-400 focus:ring-pistachio-400/20 resize-none"
          />
          <InputError message={errors.ingredients} />
        </div>
      </div>
    </section>
  );
}
