import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading2,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WysiwygEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function WysiwygEditor({ value, onChange, placeholder, className }: WysiwygEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-3 py-2',
            },
        },
    });

    // Mettre à jour le contenu de l'éditeur quand la valeur externe change
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('border border-slate-300 rounded-lg overflow-hidden bg-white', className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive('bold') ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Gras"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive('italic') ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Italique"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive('underline') ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Souligné"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive('heading', { level: 2 }) ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Titre"
                >
                    <Heading2 className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive('bulletList') ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Liste à puces"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive('orderedList') ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Liste numérotée"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive({ textAlign: 'left' }) ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Aligner à gauche"
                >
                    <AlignLeft className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive({ textAlign: 'center' }) ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Centrer"
                >
                    <AlignCenter className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors',
                        editor.isActive({ textAlign: 'right' }) ? 'bg-slate-300 text-emerald-700' : 'text-slate-700'
                    )}
                    title="Aligner à droite"
                >
                    <AlignRight className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors text-slate-700',
                        !editor.can().undo() && 'opacity-30 cursor-not-allowed'
                    )}
                    title="Annuler"
                >
                    <Undo className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={cn(
                        'rounded p-2 hover:bg-slate-200 transition-colors text-slate-700',
                        !editor.can().redo() && 'opacity-30 cursor-not-allowed'
                    )}
                    title="Refaire"
                >
                    <Redo className="h-4 w-4" />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
