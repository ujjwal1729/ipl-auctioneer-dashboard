import { useState } from 'react'

const teams = [
  'RCB', 'LSG', 'GT', 'KKR', 'SRH', 'DC', 'RR', 'PBKS', 'CSK', 'MI'
]

const teamInitialState = {
  MI: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  CSK: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  RCB: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  KKR: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  SRH: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  DC: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  RR: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  PBKS: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  LSG: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
  GT: { purse: 120, totalPlayers: 15, batters: 7, bowlers: 4, foreigners: 5 },
}

// Function to parse CSV content
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n')
  if (lines.length < 2) throw new Error('CSV must have headers and at least one player')
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const requiredHeaders = ['name', 'baseprice', 'foreigner', 'type', 'value']
  
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`)
  }
  
  const players = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    
    const values = lines[i].split(',').map(v => v.trim())
    const player = {}
    
    headers.forEach((header, index) => {
      const value = values[index]
      if (header === 'name') player.name = value
      else if (header === 'baseprice') player.basePrice = Number(value)
      else if (header === 'foreigner') player.foreigner = value.toLowerCase() === 'true'
      else if (header === 'type') player.type = value
      else if (header === 'value') player.value = Number(value)
    })
    
    if (!player.name || !player.type) {
      throw new Error(`Row ${i + 1}: Missing required data`)
    }
    
    players.push(player)
  }
  
  return players
}

export default function App() {
  const [auctionStarted, setAuctionStarted] = useState(false)
  const [players, setPlayers] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [current, setCurrent] = useState(0)
  const [assignments, setAssignments] = useState([]) // {player, team, price}
  const [price, setPrice] = useState('')
  const [teamState, setTeamState] = useState(teamInitialState)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingAssignment, setPendingAssignment] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editTeam, setEditTeam] = useState('')
  const [editPrice, setEditPrice] = useState('')

  function handleCSVUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError('')
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result
        if (typeof csvContent !== 'string') throw new Error('Failed to read file')
        
        const parsedPlayers = parseCSV(csvContent)
        if (parsedPlayers.length === 0) throw new Error('No players found in CSV')
        
        setPlayers(parsedPlayers)
        setAuctionStarted(true)
        setCurrent(0)
        setAssignments([])
        setTeamState(teamInitialState)
      } catch (error) {
        setUploadError(error.message || 'Error parsing CSV. Please check the format.')
      }
    }
    
    reader.readAsText(file)
  }

  const player = players[current]

  // If auction hasn't started, show CSV upload screen
  if (!auctionStarted) {
    return (
      <div className="app-container">
        <div className="center-panel" style={{marginTop: '60px'}}>
          <div className="card" style={{maxWidth: '500px', padding: '40px'}}>
            <h1 style={{marginTop: 0, marginBottom: 24, textAlign: 'center'}}>IPL Auctioneer Dashboard</h1>
            <p style={{textAlign: 'center', fontSize: '16px', color: 'rgba(230,238,248,0.8)', marginBottom: 32}}>
              Upload a CSV file with player details to start the auction
            </p>
            
            <div style={{
              border: '2px dashed rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(255,255,255,0.02)',
              marginBottom: 20
            }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{display: 'none'}}
                id="csv-input"
              />
              <label htmlFor="csv-input" style={{cursor: 'pointer', display: 'block'}}>
                <div style={{fontSize: '32px', marginBottom: '12px'}}>📄</div>
                <div style={{fontSize: '14px', color: 'rgba(230,238,248,0.7)'}}>
                  Click to upload CSV or drag and drop
                </div>
              </label>
            </div>

            <p style={{fontSize: '12px', color: 'rgba(230,238,248,0.6)', textAlign: 'center', marginBottom: 20}}>
              CSV must have columns: name, basePrice, foreigner, type, value
            </p>

            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              color: 'rgba(230,238,248,0.8)',
              marginBottom: 20,
              textAlign: 'left'
            }}>
              <strong>Example CSV format:</strong>
              <pre style={{margin: '8px 0 0 0', fontSize: '11px', overflow: 'auto'}}>
{`name,basePrice,foreigner,type,value
Virat Kohli,2,false,batsman,25
Rohit Sharma,2,false,batsman,20
Jasprit Bumrah,2,false,bowler,20
AB de Villiers,1.5,true,batsman,20
Rashid Khan,1.5,true,all-rounder,15`}
              </pre>
            </div>

            {uploadError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: '#fca5a5',
                marginTop: 16,
                fontSize: '14px'
              }}>
                ❌ {uploadError}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Auction interface

  function handleAssign(team) {
    if (!price || isNaN(price)) return alert('Enter valid price!')
    setPendingAssignment({ player, team, price: Number(price) })
    setShowConfirmation(true)
  }

  function confirmAssignment() {
    if (!pendingAssignment) return
    
    const { player, team, price } = pendingAssignment
    setAssignments([...assignments, { player, team, price }])
    
    // Update team state based on player type and foreigner status
    setTeamState(prev => {
      const newState = { ...prev }
      const newTeamState = { ...newState[team] }
      
      // Decrement foreigners if applicable
      if (player.foreigner && newTeamState.foreigners > 0) {
        newTeamState.foreigners -= 1
      }
      
      // Decrement based on type
      if (player.type === 'batsman' && newTeamState.batters > 0) {
        newTeamState.batters -= 1
      } else if (player.type === 'bowler' && newTeamState.bowlers > 0) {
        newTeamState.bowlers -= 1
      } else if (player.type === 'all-rounder') {
        if (newTeamState.batters > 0) newTeamState.batters -= 1
        if (newTeamState.bowlers > 0) newTeamState.bowlers -= 1
      }
      
      newState[team] = newTeamState
      return newState
    })
    
    setPrice('')
    setShowConfirmation(false)
    setPendingAssignment(null)
    setCurrent(current + 1)
  }

  function handleUnsold() {
    setPendingAssignment({ player, team: 'Unsold', price: 0 })
    setShowConfirmation(true)
  }

  function cancelConfirmation() {
    setShowConfirmation(false)
    setPendingAssignment(null)
  }

  function handleEditAssignment(index) {
    const assignment = assignments[index]
    setEditingIndex(index)
    setEditTeam(assignment.team)
    setEditPrice(assignment.price.toString())
    setShowEditModal(true)
  }

  function saveEditAssignment() {
    if (!editTeam) return alert('Please select a team')
    if (editTeam !== 'Unsold' && (!editPrice || isNaN(editPrice))) return alert('Please enter a valid price')
    
    // Create new assignments with the edited one
    const newAssignments = [...assignments]
    newAssignments[editingIndex] = {
      ...newAssignments[editingIndex],
      team: editTeam,
      price: editTeam === 'Unsold' ? 0 : Number(editPrice)
    }
    setAssignments(newAssignments)
    
    // Recalculate team state from scratch
    const newTeamState = { ...teamInitialState }
    
    newAssignments.forEach(assignment => {
      if (assignment.team === 'Unsold') return
      
      const newTeamData = { ...newTeamState[assignment.team] }
      const assignedPlayer = assignment.player
      
      // Decrement foreigners if applicable
      if (assignedPlayer.foreigner && newTeamData.foreigners > 0) {
        newTeamData.foreigners -= 1
      }
      
      // Decrement based on type
      if (assignedPlayer.type === 'batsman' && newTeamData.batters > 0) {
        newTeamData.batters -= 1
      } else if (assignedPlayer.type === 'bowler' && newTeamData.bowlers > 0) {
        newTeamData.bowlers -= 1
      } else if (assignedPlayer.type === 'all-rounder') {
        if (newTeamData.batters > 0) newTeamData.batters -= 1
        if (newTeamData.bowlers > 0) newTeamData.bowlers -= 1
      }
      
      newTeamState[assignment.team] = newTeamData
    })
    
    setTeamState(newTeamState)
    setShowEditModal(false)
    setEditingIndex(null)
    setEditTeam('')
    setEditPrice('')
  }

  function cancelEditAssignment() {
    setShowEditModal(false)
    setEditingIndex(null)
    setEditTeam('')
    setEditPrice('')
  }

  function handleNext() {
    setCurrent(current + 1)
    setPrice('')
  }

  return (
    <div className="app-container">
      <div className="center-panel">
        <h1>IPL Auctioneer Dashboard</h1>
        {player ? (
          <div className="card" style={{marginTop:12}}>
            <h2 style={{margin:0}}>{player.name}</h2>
            <p style={{margin:'6px 0 12px'}}>Base Price: ₹{player.basePrice} Crore</p>
            <p style={{margin:'4px 0 12px'}}>Value: <strong>{player.value}</strong></p>
            <p style={{margin:'4px 0 12px', fontSize:'14px', color:'rgba(230,238,248,0.7)'}}>Type: <strong>{player.type}</strong> {player.foreigner && '🌍 Foreigner'}</p>
            <input
              className="price-input"
              type="number"
              placeholder="Final Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={{ marginRight: 8, width: 140, display: 'block', margin: 'auto' }}
            />
            <div style={{marginTop:8, display:'flex', justifyContent:'center', flexWrap:'wrap', gap:6}}>
              {teams.map(team => (
                <button key={team} className="team-button" onClick={() => handleAssign(team)}>{team}</button>
              ))}
              <button className="unsold-button" onClick={handleUnsold}>Unsold</button>
            </div>
          </div>
        ) : (
          <div className="card" style={{marginTop:12}}>
            <h2>Auction Complete</h2>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingIndex !== null && assignments[editingIndex] && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Edit Assignment</h2>
            <div className="confirmation-details">
              <div className="detail-row">
                <span className="detail-label">Player:</span>
                <span className="detail-value">{assignments[editingIndex].player.name}</span>
              </div>
              <div style={{marginTop: '12px', marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '8px', color: 'rgba(230, 238, 248, 0.6)', fontSize: '12px', fontWeight: '600'}}>Team:</label>
                <select 
                  value={editTeam} 
                  onChange={(e) => setEditTeam(e.target.value)}
                  className="edit-select"
                >
                  <option value="">-- Select Team --</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                  <option value="Unsold">Unsold</option>
                </select>
              </div>
              {editTeam !== 'Unsold' && (
                <div>
                  <label style={{display: 'block', marginBottom: '8px', color: 'rgba(230, 238, 248, 0.6)', fontSize: '12px', fontWeight: '600'}}>Price (Cr):</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                      color: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={saveEditAssignment}>✓ Save Changes</button>
              <button className="cancel-btn" onClick={cancelEditAssignment}>✕ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && pendingAssignment && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Confirm Assignment</h2>
            <div className="confirmation-details">
              <div className="detail-row">
                <span className="detail-label">Player:</span>
                <span className="detail-value">{pendingAssignment.player.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Going to:</span>
                <span className="detail-value" style={{fontSize: '18px', fontWeight: 'bold', color: '#fbbf24'}}>{pendingAssignment.team}</span>
              </div>
              {pendingAssignment.team !== 'Unsold' && (
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">₹{pendingAssignment.price} Crore</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{pendingAssignment.player.type}</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmAssignment}>✓ Confirm</button>
              <button className="cancel-btn" onClick={cancelConfirmation}>✕ Cancel</button>
            </div>
          </div>
        </div>
      )}

      <h3 style={{marginTop:28, textAlign:'center'}}>Teams</h3>
      <div className="teams-grid">
        {teams.map(team => {
          const count = assignments.filter(a => a.team === team).length
          const totalSpent = assignments.filter(a => a.team === team).reduce((sum, a) => sum + a.price, 0)
          const totalValueGenerated = assignments.filter(a => a.team === team).reduce((sum, a) => sum + a.player.value, 0)
          const purseLeft = teamState[team].purse - totalSpent
          const playersLeft = teamState[team].totalPlayers - count
          const battersLeft = teamState[team].batters
          const bowlersLeft = teamState[team].bowlers
          const foreignersLeft = teamState[team].foreigners
          const icons = {
            MI: '🟦', CSK: '🟡', RCB: '🟥', KKR: '🟪', SRH: '🟠', DC: '🟢', RR: '🔴', PBKS: '🟩', LSG: '🟨', GT: '🟫'
          }
          const icon = icons[team] || '🏏'
          return (
            <div key={team} className="team-card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <img src={`/images/${team}.jpg  `} alt={team} style={{width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover'}} />
                  <div>
                    <div style={{fontWeight:700}}>{team}</div>
                    <div style={{fontSize:12,color:'rgba(230,238,248,0.7)'}}>{count} player{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="team-count">{count}</div>
              </div>
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">Players Left</span>
                  <span className="stat-value">{playersLeft}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Purse Left</span>
                  <span className="stat-value">₹{purseLeft}Cr</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Batters Left</span>
                  <span className="stat-value">{battersLeft}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Bowlers Left</span>
                  <span className="stat-value">{bowlersLeft}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">{totalValueGenerated}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Foreigners Left</span>
                  <span className="stat-value">{foreignersLeft}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <h3 style={{marginTop:28}}>Assignments</h3>
      <ul className="assignments">
        {assignments.map((a, i) => (
          <li key={i} className="assignment-item">
            <span>{a.player.name} → {a.team} {a.team !== 'Unsold' ? `for ₹${a.price} Crore` : ''}</span>
            <button className="edit-btn" onClick={() => handleEditAssignment(i)} title="Edit this assignment">✎ Edit</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
  
//delete players
//sharing
//downloading team info
//confirmation dialogue
//go back and edit info of player