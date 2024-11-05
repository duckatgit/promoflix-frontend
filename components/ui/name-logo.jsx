const NameLogo = ({ name }) => {
  const firstLetter = name?.charAt(0);
  const fullName = name?.slice(1);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '3px solid #f1c40f', // Yellow outline
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        {firstLetter}
      </div>
      <div
        style={{
          marginLeft: '10px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        {name}
      </div>
    </div>
  );
};

export { NameLogo }
