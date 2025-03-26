import { Box, IconButton, Typography } from "@mui/material";
import { BubbleMenu, Editor, EditorContent, EditorProvider, FloatingMenu, JSONContent, useCurrentEditor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./FormStyle.css";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CharacterCount from "@tiptap/extension-character-count";

interface EditorProps {
    editor: Editor | null;
}

const limit = 300;

function Menubar({ editor } : EditorProps) {
    if (!editor) {
        return null;
    }
    return (
        <div style={{ /*transform: "translate(5px, -40px)", */display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
                <FormatBoldIcon />
            </IconButton>
            <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
                <FormatItalicIcon />
            </IconButton>
            <div className="separator"></div>
            <IconButton onClick={() => editor.chain().focus().toggleStrike().run()}>
                <StrikethroughSIcon />
            </IconButton>
            <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <FormatListNumberedIcon />
            </IconButton>
            <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <FormatListBulletedIcon />
            </IconButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography style={{ marginRight: "10px", fontSize: "12px", lineHeight: "1.4", color: "#1e212a", opacity: "0.4" }}>{editor.storage.characterCount.characters()}/{limit} characters</Typography>
            </div>
        </div>
    );
}

interface TextEditorProps {
    handleUpdate: (e: Editor) => void;
    content?: JSONContent
}

export default function TextEditor({ handleUpdate, content }: TextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            CharacterCount.configure({
                limit
            }),
        ],
        content: content ? content : "Description",
        onUpdate: ({ editor }) => {
            handleUpdate(editor);
        }
    });

    return (
        <Box className="editor-container">
            <EditorContent editor={editor} />
            <Menubar editor={editor}/>
        </Box>
    )
}