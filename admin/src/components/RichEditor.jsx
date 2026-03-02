import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'align', 'list', 'link',
];

export default function RichEditor({ value, onChange }) {
  const handleChange = (html) => {
    const cleaned = html.replace(/&nbsp;/g, ' ');
    onChange(cleaned);
  };

  return (
    <div className="rich-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Escribe aquí..."
      />
    </div>
  );
}
