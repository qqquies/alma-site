function PersonCard({ photo, name, years, children, sources }) {
  return (
    <aside className="person-card">
      {photo && <img src={photo} alt={`Портрет: ${name}`} />}
      <div className="person-body">
        <h3>{name}</h3>
        <div className="person-years">{years}</div>
        <p>{children}</p>
        {sources && (
          <ul className="person-sources">
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

export default PersonCard
