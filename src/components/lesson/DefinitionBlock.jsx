function DefinitionBlock({ term, children }) {
  return (
    <div className="def-block">
      <div className="def-label">Определение</div>
      <p>
        <strong>{term}</strong> — {children}
      </p>
    </div>
  )
}

export default DefinitionBlock
