import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProductWeightVariant } from '@/types/product';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface WeightVariantManagerProps {
    variants: ProductWeightVariant[];
    onChange: (variants: ProductWeightVariant[]) => void;
    errors?: Record<string, string>;
}

export default function WeightVariantManager({
    variants,
    onChange,
    errors = {},
}: WeightVariantManagerProps) {
    const addVariant = () => {
        const newVariant: ProductWeightVariant = {
            weight_value: '',
            weight_unit: 'g',
            price: '',
            promotional_price: '',
            stock_quantity: '0',
            is_available: true,
        };
        onChange([...variants, newVariant]);
    };

    const removeVariant = (index: number) => {
        if (variants.length > 1) {
            onChange(variants.filter((_, i) => i !== index));
        }
    };

    const updateVariant = (
        index: number,
        field: keyof ProductWeightVariant,
        value: string | boolean
    ) => {
        const updatedVariants = variants.map((variant, i) => {
            if (i === index) {
                return { ...variant, [field]: value };
            }
            return variant;
        });
        onChange(updatedVariants);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                    Ajoutez au moins une déclinaison de poids pour le produit
                </p>
                <Button type="button" onClick={addVariant} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter
                </Button>
            </div>

            {errors.weight_variants && (
                <p className="text-sm text-destructive mb-2">
                    {errors.weight_variants}
                </p>
            )}

            <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
                    <div className="col-span-2">Poids *</div>
                    <div className="col-span-1">Unité *</div>
                    <div className="col-span-2">Prix (TND) *</div>
                    <div className="col-span-2">Prix promo (TND)</div>
                    <div className="col-span-2">Stock</div>
                    <div className="col-span-2">Disponible</div>
                    <div className="col-span-1 text-center">Actions</div>
                </div>

                {/* Variants */}
                {variants.map((variant, index) => (
                    <div key={index} className="space-y-1">
                        <div className="grid grid-cols-12 gap-2 items-center p-2 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors">
                            {/* Poids */}
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.weight_value}
                                    onChange={(e) =>
                                        updateVariant(index, 'weight_value', e.target.value)
                                    }
                                    placeholder="250"
                                    className="h-9 text-sm"
                                />
                            </div>

                            {/* Unité */}
                            <div className="col-span-1">
                                <Select
                                    value={variant.weight_unit}
                                    onValueChange={(value) =>
                                        updateVariant(index, 'weight_unit', value)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="g">g</SelectItem>
                                        <SelectItem value="kg">kg</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Prix */}
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.price}
                                    onChange={(e) =>
                                        updateVariant(index, 'price', e.target.value)
                                    }
                                    placeholder="0.00"
                                    className="h-9 text-sm"
                                />
                            </div>

                            {/* Prix promotionnel */}
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.promotional_price}
                                    onChange={(e) =>
                                        updateVariant(index, 'promotional_price', e.target.value)
                                    }
                                    placeholder="0.00"
                                    className="h-9 text-sm"
                                />
                            </div>

                            {/* Stock */}
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    min="0"
                                    value={variant.stock_quantity}
                                    onChange={(e) =>
                                        updateVariant(index, 'stock_quantity', e.target.value)
                                    }
                                    placeholder="0"
                                    className="h-9 text-sm"
                                />
                            </div>

                            {/* Disponible */}
                            <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={variant.is_available}
                                        onCheckedChange={(checked) =>
                                            updateVariant(index, 'is_available', checked)
                                        }
                                    />
                                    {variant.is_available ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeVariant(index)}
                                    disabled={variants.length === 1}
                                    className="h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>

                        {/* Erreurs pour cette ligne */}
                        {(errors[`weight_variants.${index}.weight_value`] ||
                            errors[`weight_variants.${index}.weight_unit`] ||
                            errors[`weight_variants.${index}.price`] ||
                            errors[`weight_variants.${index}.promotional_price`] ||
                            errors[`weight_variants.${index}.stock_quantity`]) && (
                            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 space-y-1">
                                {errors[`weight_variants.${index}.weight_value`] && (
                                    <div>• {errors[`weight_variants.${index}.weight_value`]}</div>
                                )}
                                {errors[`weight_variants.${index}.weight_unit`] && (
                                    <div>• {errors[`weight_variants.${index}.weight_unit`]}</div>
                                )}
                                {errors[`weight_variants.${index}.price`] && (
                                    <div>• {errors[`weight_variants.${index}.price`]}</div>
                                )}
                                {errors[`weight_variants.${index}.promotional_price`] && (
                                    <div>• {errors[`weight_variants.${index}.promotional_price`]}</div>
                                )}
                                {errors[`weight_variants.${index}.stock_quantity`] && (
                                    <div>• {errors[`weight_variants.${index}.stock_quantity`]}</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
