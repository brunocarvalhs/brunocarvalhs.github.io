const SidebarNavigation = ({ tree, onSelect, selectedFile }: { tree: any, onSelect: (path: string) => void, selectedFile: string | null }) => {
  const renderTree = (node: any, path = ''): JSX.Element[] => {
    return Object.entries(node).map(([key, value]) => {
      const fullPath = path ? `${path}/${key}` : key;
      if (typeof value === 'string') {
        return (
          <div
            key={fullPath}
            className={`cursor-pointer px-2 py-1 text-sm hover:bg-blue-100 rounded ${selectedFile === fullPath ? 'bg-blue-200 font-bold' : ''}`}
            onClick={() => onSelect(fullPath)}
          >
            {key}
          </div>
        );
      } else {
        return (
          <div key={fullPath} className="ml-2">
            <div className="font-semibold text-sm mt-2">{key}</div>
            <div className="ml-2">
              {renderTree(value, fullPath)}
            </div>
          </div>
        );
      }
    });
  };

  return <div>{renderTree(tree)}</div>;
};

export default SidebarNavigation;