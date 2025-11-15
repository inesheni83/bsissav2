import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { ProductFormData, ProductFormErrors } from '@/types/product';

export function useProductForm() {
  const [autoSlug, setAutoSlug] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, processing, errors, reset } = useForm<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    detailed_description: '',
    ingredients: '',
    marketing_tags: '',
    image: null,
    category_id: '',
    is_featured: false,
    calories_kcal: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    fiber_g: '',
    weight_variants: [
      {
        weight_value: '',
        weight_unit: 'g',
        price: '',
        promotional_price: '',
        stock_quantity: '0',
        is_available: true,
      },
    ],
  });

  // Génération automatique du slug à partir du nom
  useEffect(() => {
    if (autoSlug && data.name) {
      setData('slug', slugify(data.name));
    }
  }, [data.name, autoSlug, setData]);

  // Nettoyage de l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const slugify = (value: string): string => {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setData('image', file);

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    reset();
    setAutoSlug(true);
    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  };

  const submitForm = (
    e: React.FormEvent,
    routeName: string,
    method: 'post' | 'put' = 'post',
    options: any = {},
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Préparer les données
    const payload: any = {
      ...data,
    };

    // Ajouter _method pour method spoofing si PUT
    if (method === 'put') {
      payload._method = 'PUT';
    }

    // Supprimer l'image si ce n'est pas un nouveau fichier
    if (!(data.image instanceof File)) {
      delete payload.image;
    }

    // Convertir category_id en nombre si c'est une chaîne non vide
    if (typeof payload.category_id === 'string' && payload.category_id.trim() !== '') {
      payload.category_id = Number(payload.category_id.trim());
    } else if (payload.category_id === '' || payload.category_id === null) {
      // Si vide, supprimer pour éviter les erreurs de validation
      delete payload.category_id;
    }

    // Nettoyer et formater les weight_variants
    if (payload.weight_variants && Array.isArray(payload.weight_variants)) {
      payload.weight_variants = payload.weight_variants.map((variant: any) => {
        const cleaned: any = {
          weight_value: variant.weight_value !== '' ? parseFloat(variant.weight_value) : '',
          weight_unit: variant.weight_unit || 'g',
          price: variant.price !== '' ? parseFloat(variant.price) : '',
          promotional_price: variant.promotional_price !== '' ? parseFloat(variant.promotional_price) : null,
          stock_quantity: variant.stock_quantity !== '' ? parseInt(variant.stock_quantity, 10) : 0,
          is_available: Boolean(variant.is_available),
        };

        // Garder l'ID si c'est une mise à jour
        if (variant.id) {
          cleaned.id = variant.id;
        }

        return cleaned;
      });
    }

    const { onError, onSuccess, onFinish, ...restOptions } = options;

    // Toujours utiliser router.post() car forceFormData ne fonctionne pas avec put()
    router.post(routeName, payload, {
      forceFormData: true,
      preserveState: false,
      preserveScroll: false,
      ...restOptions,
      onError: (formErrors: any) => {
        console.error('Submission errors:', formErrors);
        onError?.(formErrors);
      },
      onSuccess: (page: any) => {
        console.log('Submission success, redirecting...');
        onSuccess?.(page);
      },
      onFinish: () => {
        console.log('Submission finished');
        onFinish?.();
      },
    });
  };

  return {
    data,
    setData,
    processing,
    errors: errors as ProductFormErrors,
    autoSlug,
    setAutoSlug,
    imagePreview,
    setImagePreview,
    handleImageChange,
    resetForm,
    submitForm,
    slugify,
  };
}
