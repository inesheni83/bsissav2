import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { ProductFormData, ProductFormErrors } from '@/types/product';

interface NutritionalInfoProps {
  data: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function NutritionalInfo({ data, errors, onChange }: NutritionalInfoProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-xl font-medium text-foreground">Valeurs nutritionnelles</h3>
          <p className="text-muted-foreground">Informations par portion (optionnel)</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Calories */}
        <div className="space-y-3">
          <Label htmlFor="calories_kcal" className="text-sm font-medium text-foreground">
            Calories (kcal)
          </Label>
          <Input
            id="calories_kcal"
            name="calories_kcal"
            type="number"
            min="0"
            value={data.calories_kcal}
            onChange={(e) => onChange('calories_kcal', e.target.value)}
            placeholder="250"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.calories_kcal} />
        </div>

        {/* Protéines */}
        <div className="space-y-3">
          <Label htmlFor="protein_g" className="text-sm font-medium text-foreground">
            Protéines (g)
          </Label>
          <Input
            id="protein_g"
            name="protein_g"
            type="number"
            step="0.1"
            min="0"
            value={data.protein_g}
            onChange={(e) => onChange('protein_g', e.target.value)}
            placeholder="12.5"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.protein_g} />
        </div>

        {/* Glucides */}
        <div className="space-y-3">
          <Label htmlFor="carbs_g" className="text-sm font-medium text-foreground">
            Glucides (g)
          </Label>
          <Input
            id="carbs_g"
            name="carbs_g"
            type="number"
            step="0.1"
            min="0"
            value={data.carbs_g}
            onChange={(e) => onChange('carbs_g', e.target.value)}
            placeholder="30.2"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.carbs_g} />
        </div>

        {/* Lipides */}
        <div className="space-y-3">
          <Label htmlFor="fat_g" className="text-sm font-medium text-foreground">
            Lipides (g)
          </Label>
          <Input
            id="fat_g"
            name="fat_g"
            type="number"
            step="0.1"
            min="0"
            value={data.fat_g}
            onChange={(e) => onChange('fat_g', e.target.value)}
            placeholder="8.1"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.fat_g} />
        </div>

        {/* Fibres */}
        <div className="space-y-3">
          <Label htmlFor="fiber_g" className="text-sm font-medium text-foreground">
            Fibres (g)
          </Label>
          <Input
            id="fiber_g"
            name="fiber_g"
            type="number"
            step="0.1"
            min="0"
            value={data.fiber_g}
            onChange={(e) => onChange('fiber_g', e.target.value)}
            placeholder="5.3"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.fiber_g} />
        </div>
      </div>

      <div className="text-xs text-muted-foreground bg-beige-50/50 p-4 rounded-lg border border-beige-200/50">
        <p className="font-medium mb-1">💡 Conseil :</p>
        <p>Les valeurs nutritionnelles sont affichées par portion. Laissez vide si non applicable à votre produit.</p>
      </div>
    </section>
  );
}
