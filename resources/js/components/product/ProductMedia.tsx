import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { ProductFormData, ProductFormErrors } from '@/types/product';

interface ProductMediaProps {
  data: ProductFormData;
  errors: ProductFormErrors;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
  onRemoveImage: () => void;
}

export function ProductMedia({
  data,
  errors,
  imagePreview,
  onImageChange,
  onChange,
  onRemoveImage
}: ProductMediaProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="space-y-3">
          <Label htmlFor="image" className="text-sm font-medium text-foreground">
            Image du produit
          </Label>
          <div className="border-2 border-dashed border-beige-200 rounded-xl p-6 text-center hover:border-pistachio-300 transition-colors">
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
            <label htmlFor="image" className="cursor-pointer">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-pistachio-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-pistachio-600 text-lg">+</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">Ajouter une image</p>
                  <p className="text-muted-foreground text-xs">PNG, JPG jusqu'à 5MB</p>
                </div>
              </div>
            </label>
          </div>
          <InputError message={errors.image} />

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="h-24 w-24 object-cover rounded-lg shadow-md border border-beige-200"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Tags marketing */}
        <div className="space-y-3">
          <Label htmlFor="marketing_tags" className="text-sm font-medium text-foreground">
            Tags marketing
          </Label>
          <Input
            id="marketing_tags"
            name="marketing_tags"
            value={data.marketing_tags}
            onChange={(e) => onChange('marketing_tags', e.target.value)}
            placeholder="Ex: bio, local, traditionnel, artisanal"
            className="h-11 border-beige-200 focus:border-pistachio-400 focus:ring-pistachio-400/20"
          />
          <InputError message={errors.marketing_tags} />
        </div>
      </div>
    </section>
  );
}
