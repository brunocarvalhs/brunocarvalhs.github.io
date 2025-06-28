const ProjectSelector = ({ projects, selected, onSelect }: { projects: string[], selected: string | null, onSelect: (p: string) => void }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2">Projeto</label>
      <select
        className="w-full border border-gray-300 rounded px-2 py-1"
        value={selected || ''}
        onChange={e => onSelect(e.target.value)}
      >
        <option value="" disabled>Selecione um projeto</option>
        {projects.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;