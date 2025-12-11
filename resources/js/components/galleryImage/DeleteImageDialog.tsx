import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

type DeleteImageDialogProps = {
    imageName: string;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteImageDialog({
    imageName,
    isDeleting,
    onConfirm,
    onCancel
}: DeleteImageDialogProps) {
    return (
        <Dialog open onOpenChange={(open) => !open && onCancel()}>
            <DialogContent aria-describedby="delete-dialog-description">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
                        Confirmer la suppression
                    </DialogTitle>
                    <DialogDescription id="delete-dialog-description">
                        Êtes-vous sûr de vouloir supprimer l'image <strong>"{imageName}"</strong> ?
                        Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isDeleting}
                        aria-label="Annuler la suppression"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        aria-label={`Confirmer la suppression de ${imageName}`}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                Suppression...
                            </>
                        ) : (
                            'Supprimer'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
