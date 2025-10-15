import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Home, Building2, User, Search, Filter, FileText, Upload, Clock, Info } from 'lucide-react'

// ------------------ Mock Data ------------------
const locationOffers = [
  {
    id: 'loc-1',
    titre: 'T2 meublé proche centre',
    ville: 'Fort-de-France',
    meuble: true,
    colocation: false,
    chambres: 1,
    chargesIncluses: true,
    loyer: 850,
    surface: 42,
    datePublication: '2025-09-20',
    history: [
      { date: '2025-09-20', prix: 900 },
      { date: '2025-10-01', prix: 870 },
      { date: '2025-10-10', prix: 850 },
    ],
    details: 'Cuisine équipée, clim, balcon, 3e étage sans ascenseur.',
  },
  {
    id: 'loc-2',
    titre: 'Colocation T4 – chambres 12m²',
    ville: 'Pointe-à-Pitre',
    meuble: false,
    colocation: true,
    chambres: 3,
    chargesIncluses: false,
    loyer: 520,
    surface: 90,
    datePublication: '2025-10-05',
    history: [
      { date: '2025-10-05', prix: 550 },
      { date: '2025-10-12', prix: 520 },
    ],
    details: 'Grande pièce de vie, proche transports et commerces.',
  },
  {
    id: 'loc-3',
    titre: 'Studio vue mer',
    ville: 'Schoelcher',
    meuble: true,
    colocation: false,
    chambres: 0,
    chargesIncluses: true,
    loyer: 680,
    surface: 28,
    datePublication: '2025-09-28',
    history: [
      { date: '2025-09-28', prix: 700 },
      { date: '2025-10-08', prix: 680 },
    ],
    details: 'Idéal étudiant, parking sécurisé, résidence récente.',
  },
]

const venteOffers = [
  {
    id: 'ven-1',
    titre: 'Maison F4 avec jardin',
    ville: 'Le Lamentin',
    type: 'maison',
    surface: 120,
    prix: 320000,
    dateConstruction: 2012,
    taxeFonciere: 1800,
    chargesCopro: 0,
    occupe: false,
    datePublication: '2025-09-12',
    history: [
      { date: '2025-09-12', prix: 335000 },
      { date: '2025-10-01', prix: 325000 },
      { date: '2025-10-13', prix: 320000 },
    ],
    details: 'Quartier calme, 2 places de parking, proche écoles.',
  },
  {
    id: 'ven-2',
    titre: 'Appartement T3 centre-ville',
    ville: 'Cayenne',
    type: 'appartement',
    surface: 68,
    prix: 210000,
    dateConstruction: 2005,
    taxeFonciere: 1300,
    chargesCopro: 1200,
    occupe: true,
    datePublication: '2025-10-02',
    history: [
      { date: '2025-10-02', prix: 215000 },
      { date: '2025-10-10', prix: 210000 },
    ],
    details: "Avec balcon, 4e étage ascenseur, loué jusqu'à juin 2026.",
  },
  {
    id: 'ven-3',
    titre: 'Local commercial 55m²',
    ville: 'Fort-de-France',
    type: 'local',
    surface: 55,
    prix: 165000,
    dateConstruction: 1998,
    taxeFonciere: 980,
    chargesCopro: 600,
    occupe: false,
    datePublication: '2025-09-25',
    history: [
      { date: '2025-09-25', prix: 175000 },
      { date: '2025-10-07', prix: 165000 },
    ],
    details: 'RDC, vitrine angle de rue, passage fréquent.',
  },
]

const lawDocs = [
  {
    id: 'loi-1',
    titre: 'Droits et obligations du locataire',
    contenu:
      'Dépôt de garantie, entretien courant, respect du bail, préavis… (contenu factice pour le prototype).',
  },
  {
    id: 'loi-2',
    titre: 'Droits et obligations du bailleur (loueur)',
    contenu:
      'Logement décent, délivrance des quittances, réparations, révision du loyer… (contenu factice).',
  },
  {
    id: 'loi-3',
    titre: 'Processus de vente immobilière',
    contenu:
      'Compromis, diagnostics, acte authentique, délais de rétractation… (contenu factice).',
  },
]

const daysSince = (dateStr) => {
  const ms = Date.now() - new Date(dateStr).getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

function PriceHistory({ data }) {
  const chartData = data.map((d) => ({ name: d.date, value: d.prix }))
  return (
    <div style={{height:160, width:'100%'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function ListingCard({ item, kind, onOpen }) {
  return (
    <div className="card" onClick={() => onOpen(item)} style={{cursor:'pointer'}}>
      <h3 style={{display:'flex',alignItems:'center',gap:8}}>
        {kind === 'location' ? <Home size={18}/> : <Building2 size={18}/>}
        {item.titre}
      </h3>
      <div className="kv"><span className="k">Ville: </span>{item.ville}</div>
      {kind === 'location' ? (
        <>
          <div className="kv"><span className="k">Loyer: </span>{item.loyer} € /mois</div>
          <div className="kv"><span className="k">Surface: </span>{item.surface} m²</div>
          <div style={{marginTop:6}}>
            <span className="badge">{item.meuble ? 'Meublé' : 'Non meublé'}</span>
            {item.colocation && <span className="badge">Colocation</span>}
            <span className="badge">{item.chargesIncluses ? 'Charges incluses' : 'Charges non incluses'}</span>
          </div>
        </>
      ) : (
        <>
          <div className="kv"><span className="k">Prix: </span>{item.prix.toLocaleString('fr-FR')} €</div>
          <div className="kv"><span className="k">Surface: </span>{item.surface} m²</div>
          <div className="kv"><span className="k">Type: </span>{item.type}</div>
          <div className="kv"><span className="k">Constr.: </span>{item.dateConstruction}</div>
          <div style={{marginTop:6}}>
            <span className="badge">{item.occupe ? 'Occupé' : 'Libre'}</span>
            <span className="badge">Taxe foncière: {item.taxeFonciere} €</span>
            {item.chargesCopro > 0 && <span className="badge">Charges copro: {item.chargesCopro} €</span>}
          </div>
        </>
      )}
      <div className="card-footer">
        <Clock size={14}/> En ligne depuis {daysSince(item.datePublication)} jours
      </div>
    </div>
  )
}

export default function App(){
  const [tab, setTab] = useState('location')
  const [query, setQuery] = useState('')
  const [openItem, setOpenItem] = useState(null)

  const [locFilters, setLocFilters] = useState({meuble:'all', coloc:'all', chambresMin:0, charges:'all', loyerMax:0})
  const [venFilters, setVenFilters] = useState({type:'all', surfaceMin:0, prixMax:0, occupe:'all'})
  const [role, setRole] = useState('locataire')

  const locList = useMemo(() => {
    return locationOffers.filter((o) => {
      const q = query.toLowerCase()
      const matchesQuery = !q || o.titre.toLowerCase().includes(q) || o.ville.toLowerCase().includes(q)
      const byMeuble = locFilters.meuble === 'all' || (locFilters.meuble === 'meuble' ? o.meuble : !o.meuble)
      const byColoc = locFilters.coloc === 'all' || (locFilters.coloc === 'oui' ? o.colocation : !o.colocation)
      const byCh = o.chambres >= (locFilters.chambresMin || 0)
      const byCharges = locFilters.charges === 'all' || (locFilters.charges === 'oui' ? o.chargesIncluses : !o.chargesIncluses)
      const byLoyer = !locFilters.loyerMax || o.loyer <= locFilters.loyerMax
      return matchesQuery && byMeuble && byColoc && byCh && byCharges && byLoyer
    })
  }, [query, locFilters])

  const venList = useMemo(() => {
    return venteOffers.filter((o) => {
      const q = query.toLowerCase()
      const matchesQuery = !q || o.titre.toLowerCase().includes(q) || o.ville.toLowerCase().includes(q)
      const byType = venFilters.type === 'all' || o.type === venFilters.type
      const bySurf = o.surface >= (venFilters.surfaceMin || 0)
      const byPrix = !venFilters.prixMax || o.prix <= venFilters.prixMax
      const byOcc = venFilters.occupe === 'all' || (venFilters.occupe === 'oui' ? o.occupe : !o.occupe)
      return matchesQuery && byType && bySurf && byPrix && byOcc
    })
  }, [query, venFilters])

  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}}>
              <div className="logo">A</div>
            </motion.div>
            <div className="title">
              <h1>A kaz aw</h1>
              <p>Annonces & Espace perso immobilier</p>
            </div>
          </div>
          <div className="search">
            <div className="input-wrap">
              <Search/>
              <input className="input" placeholder="Rechercher une ville, un titre…" value={query} onChange={e=>setQuery(e.target.value)} />
            </div>
            <button className="btn"><Filter size={16}/>Filtres</button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="tabs">
          <button className={`tab ${tab==='location'?'active':''}`} onClick={()=>setTab('location')}><Home size={16}/>Location</button>
          <button className={`tab ${tab==='vente'?'active':''}`} onClick={()=>setTab('vente')}><Building2 size={16}/>Vente</button>
          <button className={`tab ${tab==='espace'?'active':''}`} onClick={()=>setTab('espace')}><User size={16}/>Espace perso</button>
        </div>

        {tab==='location' && (
          <section style={{marginTop:24}} className="layout">
            <aside className="card">
              <h3>Filtres (location)</h3>
              <div className="filters">
                <label>Type d'ameublement</label>
                <select value={locFilters.meuble} onChange={e=>setLocFilters(f=>({...f,meuble:e.target.value}))}>
                  <option value="all">Tous</option>
                  <option value="meuble">Meublé</option>
                  <option value="nu">Non meublé</option>
                </select>

                <label>Colocation</label>
                <select value={locFilters.coloc} onChange={e=>setLocFilters(f=>({...f,coloc:e.target.value}))}>
                  <option value="all">Indifférent</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>

                <label>Chambres (min)</label>
                <input type="number" min="0" value={locFilters.chambresMin} onChange={e=>setLocFilters(f=>({...f,chambresMin:Number(e.target.value||0)}))}/>

                <label>Charges incluses</label>
                <select value={locFilters.charges} onChange={e=>setLocFilters(f=>({...f,charges:e.target.value}))}>
                  <option value="all">Indifférent</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>

                <label>Loyer max (€)</label>
                <input type="number" min="0" value={locFilters.loyerMax} onChange={e=>setLocFilters(f=>({...f,loyerMax:Number(e.target.value||0)}))}/>
              </div>
            </aside>
            <div className="grid">
              {locList.map(item => (
                <ListingCard key={item.id} item={item} kind="location" onOpen={setOpenItem}/>
              ))}
              {locList.length===0 && (<div className="card empty">Aucune offre ne correspond à vos filtres.</div>)}
            </div>
          </section>
        )}

        {tab==='vente' && (
          <section style={{marginTop:24}} className="layout">
            <aside className="card">
              <h3>Filtres (vente)</h3>
              <div className="filters">
                <label>Type de bien</label>
                <select value={venFilters.type} onChange={e=>setVenFilters(f=>({...f,type:e.target.value}))}>
                  <option value="all">Tous</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="local">Local commercial</option>
                </select>

                <label>Surface min (m²)</label>
                <input type="number" min="0" value={venFilters.surfaceMin} onChange={e=>setVenFilters(f=>({...f,surfaceMin:Number(e.target.value||0)}))}/>

                <label>Prix max (€)</label>
                <input type="number" min="0" value={venFilters.prixMax} onChange={e=>setVenFilters(f=>({...f,prixMax:Number(e.target.value||0)}))}/>

                <label>Occupé</label>
                <select value={venFilters.occupe} onChange={e=>setVenFilters(f=>({...f,occupe:e.target.value}))}>
                  <option value="all">Indifférent</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
            </aside>
            <div className="grid">
              {venList.map(item => (
                <ListingCard key={item.id} item={item} kind="vente" onOpen={setOpenItem}/>
              ))}
              {venList.length===0 && (<div className="card empty">Aucun bien ne correspond à vos filtres.</div>)}
            </div>
          </section>
        )}

        {tab==='espace' && (
          <section style={{marginTop:24}} className="layout">
            <aside className="card">
              <h3>Votre profil</h3>
              <div className="filters">
                <label>Je suis</label>
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  <option value="locataire">Locataire</option>
                  <option value="loueur">Loueur / Bailleur</option>
                  <option value="vendeur">Vendeur</option>
                </select>
                <div className="small" style={{display:'flex',gap:6,alignItems:'center'}}><Info size={14}/>Sélectionnez votre rôle pour afficher les documents adaptés.</div>
              </div>

              <div style={{marginTop:16}}>
                <h3>Documents de loi (France)</h3>
                {lawDocs.map(d => (
                  <details key={d.id} className="card" style={{marginTop:8}}>
                    <summary>{d.titre}</summary>
                    <div className="small" style={{marginTop:8}}>{d.contenu}</div>
                  </details>
                ))}
              </div>
            </aside>

            <div className="card">
              <h3>Votre documentation</h3>
              {role==='locataire' && (
                <div style={{display:'grid',gap:10}}>
                  <DocRow name="Quittances de loyer" actions={['consulter','télécharger']}/>
                  <DocRow name="État des lieux (template)" actions={['remplir en ligne','télécharger']}/>
                  <DocRow name="Contrat de location (bail)" actions={['prévisualiser','télécharger']}/>
                </div>
              )}
              {role==='loueur' && (
                <div style={{display:'grid',gap:10}}>
                  <DocRow name="Bail meublé / non meublé (modèles)" actions={['remplir en ligne','télécharger']}/>
                  <DocRow name="État des lieux d\\'entrée/sortie" actions={['remplir en ligne','télécharger']}/>
                  <DocRow name="Quittances (génération)" actions={['générer','exporter pdf']}/>
                </div>
              )}
              {role==='vendeur' && (
                <div style={{display:'grid',gap:10}}>
                  <DocRow name="Dossier de diagnostics techniques (DDT)" actions={['ajouter','consulter']}/>
                  <DocRow name="Compromis / promesse de vente (modèle)" actions={['prévisualiser','télécharger']}/>
                  <DocRow name="Acte de vente (référentiel)" actions={['consulter']}/>
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                <div className="small">Chargez vos PDF, images ou docx</div>
                <button className="btn"><Upload size={16}/>Importer un document</button>
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="sheet {openItem ? 'open' : ''}"></div>
      <div className={`sheet ${openItem ? 'open' : ''}`}>
        {openItem && (
          <div className="sheet-body">
            <h2 style={{margin:'0 0 4px 0'}}>{openItem.titre}</h2>
            <div className="small">{openItem.ville} • Publié il y a {daysSince(openItem.datePublication)} jours</div>
            <div style={{marginTop:12}} className="small">{openItem.details}</div>
            <div className="card" style={{marginTop:12}}>
              <h3>Historique des prix</h3>
              <PriceHistory data={openItem.history}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10,marginTop:10}}>
              {'loyer' in openItem ? (
                <>
                  <InfoLine label="Loyer actuel" value={`${openItem.loyer} € /mois`} />
                  <InfoLine label="Surface" value={`${openItem.surface} m²`} />
                  <InfoLine label="Meublé" value={openItem.meuble ? 'Oui' : 'Non'} />
                  <InfoLine label="Colocation" value={openItem.colocation ? 'Oui' : 'Non'} />
                  <InfoLine label="Charges incluses" value={openItem.chargesIncluses ? 'Oui' : 'Non'} />
                </>
              ) : (
                <>
                  <InfoLine label="Prix actuel" value={`${openItem.prix.toLocaleString('fr-FR')} €`} />
                  <InfoLine label="Surface" value={`${openItem.surface} m²`} />
                  <InfoLine label="Type" value={openItem.type} />
                  <InfoLine label="Construction" value={openItem.dateConstruction} />
                  <InfoLine label="Occupé" value={openItem.occupe ? 'Oui' : 'Non'} />
                  <InfoLine label="Taxe foncière" value={`${openItem.taxeFonciere} €`} />
                  {openItem.chargesCopro > 0 && <InfoLine label="Charges copro" value={`${openItem.chargesCopro} €`} />}
                </>
              )}
            </div>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btn primary" style={{flex:1}}>Contacter</button>
              <button className="btn" style={{flex:1}}>Ajouter aux favoris</button>
            </div>
            <div style={{marginTop:10}}>
              <button className="btn" onClick={()=>setOpenItem(null)}>Fermer</button>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">© {new Date().getFullYear()} A kaz aw — Prototype UI</footer>
    </div>
  )
}

function InfoLine({ label, value }){
  return (<div className="kv"><span className="k">{label}: </span><span style={{fontWeight:600}}>{value}</span></div>)
}

function DocRow({ name, actions=[] }){
  return (
    <div className="row">
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <FileText size={16}/>
        <span style={{fontWeight:600}}>{name}</span>
      </div>
      <div className="doc-actions">
        {actions.map(a => (
          <button key={a} className="btn">{a}</button>
        ))}
      </div>
    </div>
  )
}
