import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Home, Building2, User, Search, Filter, FileText, Upload, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// ------------------ Mock Data ------------------
const locationOffers = [
  {
    id: "loc-1",
    titre: "T2 meublé proche centre",
    ville: "Fort-de-France",
    meuble: true,
    colocation: false,
    chambres: 1,
    chargesIncluses: true,
    loyer: 850,
    surface: 42,
    datePublication: "2025-09-20",
    history: [
      { date: "2025-09-20", prix: 900 },
      { date: "2025-10-01", prix: 870 },
      { date: "2025-10-10", prix: 850 },
    ],
    details: "Cuisine équipée, clim, balcon, 3e étage sans ascenseur.",
  },
  {
    id: "loc-2",
    titre: "Colocation T4 – chambres 12m²",
    ville: "Pointe-à-Pitre",
    meuble: false,
    colocation: true,
    chambres: 3,
    chargesIncluses: false,
    loyer: 520,
    surface: 90,
    datePublication: "2025-10-05",
    history: [
      { date: "2025-10-05", prix: 550 },
      { date: "2025-10-12", prix: 520 },
    ],
    details: "Grande pièce de vie, proche transports et commerces.",
  },
  {
    id: "loc-3",
    titre: "Studio vue mer",
    ville: "Schoelcher",
    meuble: true,
    colocation: false,
    chambres: 0,
    chargesIncluses: true,
    loyer: 680,
    surface: 28,
    datePublication: "2025-09-28",
    history: [
      { date: "2025-09-28", prix: 700 },
      { date: "2025-10-08", prix: 680 },
    ],
    details: "Idéal étudiant, parking sécurisé, résidence récente.",
  },
];

const venteOffers = [
  {
    id: "ven-1",
    titre: "Maison F4 avec jardin",
    ville: "Le Lamentin",
    type: "maison",
    surface: 120,
    prix: 320000,
    dateConstruction: 2012,
    taxeFonciere: 1800,
    chargesCopro: 0,
    occupe: false,
    datePublication: "2025-09-12",
    history: [
      { date: "2025-09-12", prix: 335000 },
      { date: "2025-10-01", prix: 325000 },
      { date: "2025-10-13", prix: 320000 },
    ],
    details: "Quartier calme, 2 places de parking, proche écoles.",
  },
  {
    id: "ven-2",
    titre: "Appartement T3 centre-ville",
    ville: "Cayenne",
    type: "appartement",
    surface: 68,
    prix: 210000,
    dateConstruction: 2005,
    taxeFonciere: 1300,
    chargesCopro: 1200,
    occupe: true,
    datePublication: "2025-10-02",
    history: [
      { date: "2025-10-02", prix: 215000 },
      { date: "2025-10-10", prix: 210000 },
    ],
    details: "Avec balcon, 4e étage ascenseur, loué jusqu'à juin 2026.",
  },
  {
    id: "ven-3",
    titre: "Local commercial 55m²",
    ville: "Fort-de-France",
    type: "local",
    surface: 55,
    prix: 165000,
    dateConstruction: 1998,
    taxeFonciere: 980,
    chargesCopro: 600,
    occupe: false,
    datePublication: "2025-09-25",
    history: [
      { date: "2025-09-25", prix: 175000 },
      { date: "2025-10-07", prix: 165000 },
    ],
    details: "RDC, vitrine angle de rue, passage fréquent.",
  },
];

const lawDocs = [
  {
    id: "loi-1",
    titre: "Droits et obligations du locataire",
    contenu:
      "Dépôt de garantie, entretien courant, respect du bail, préavis… (contenu factice pour le prototype).",
  },
  {
    id: "loi-2",
    titre: "Droits et obligations du bailleur (loueur)",
    contenu:
      "Logement décent, délivrance des quittances, réparations, révision du loyer… (contenu factice).",
  },
  {
    id: "loi-3",
    titre: "Processus de vente immobilière",
    contenu:
      "Compromis, diagnostics, acte authentique, délais de rétractation… (contenu factice).",
  },
];

// ------------------ Helpers ------------------
const daysSince = (dateStr) => {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

function PriceHistory({ data }) {
  const chartData = data.map((d) => ({ name: d.date, value: d.prix }));
  return (
    <div className="h-40 w-full">
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
  );
}

function ListingCard({ item, kind, onOpen }) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => onOpen(item)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {kind === "location" ? <Home className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
          {item.titre}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Ville:</span> {item.ville}
        </div>
        {kind === "location" ? (
          <>
            <div>
              <span className="font-medium">Loyer:</span> {item.loyer} € /mois
            </div>
            <div>
              <span className="font-medium">Surface:</span> {item.surface} m²
            </div>
            <div className="col-span-2 flex gap-2">
              {item.meuble ? <Badge>Meublé</Badge> : <Badge variant="secondary">Non meublé</Badge>}
              {item.colocation && <Badge variant="outline">Colocation</Badge>}
              {item.chargesIncluses ? (
                <Badge variant="success">Charges incluses</Badge>
              ) : (
                <Badge variant="destructive">Charges non incluses</Badge>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="font-medium">Prix:</span> {item.prix.toLocaleString("fr-FR")} €
            </div>
            <div>
              <span className="font-medium">Surface:</span> {item.surface} m²
            </div>
            <div>
              <span className="font-medium">Type:</span> {item.type}
            </div>
            <div>
              <span className="font-medium">Constr.:</span> {item.dateConstruction}
            </div>
            <div className="col-span-2 flex flex-wrap gap-2">
              <Badge variant={item.occupe ? "secondary" : "default"}>{item.occupe ? "Occupé" : "Libre"}</Badge>
              <Badge variant="outline">Taxe foncière: {item.taxeFonciere} €</Badge>
              {item.chargesCopro > 0 && (
                <Badge variant="outline">Charges copro: {item.chargesCopro} €</Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        En ligne depuis {daysSince(item.datePublication)} jours
      </CardFooter>
    </Card>
  );
}

function FiltersLocation({ filters, setFilters }) {
  return (
    <div className="grid gap-3">
      <Label>Type d'ameublement</Label>
      <Select
        value={filters.meuble}
        onValueChange={(v) => setFilters((f) => ({ ...f, meuble: v }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tous" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="meuble">Meublé</SelectItem>
          <SelectItem value="nu">Non meublé</SelectItem>
        </SelectContent>
      </Select>

      <Label>Colocation</Label>
      <Select
        value={filters.coloc}
        onValueChange={(v) => setFilters((f) => ({ ...f, coloc: v }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Indifférent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Indifférent</SelectItem>
          <SelectItem value="oui">Oui</SelectItem>
          <SelectItem value="non">Non</SelectItem>
        </SelectContent>
      </Select>

      <Label>Chambres (min)</Label>
      <Input
        type="number"
        min={0}
        value={filters.chambresMin}
        onChange={(e) => setFilters((f) => ({ ...f, chambresMin: Number(e.target.value || 0) }))}
      />

      <Label>Charges incluses</Label>
      <Select
        value={filters.charges}
        onValueChange={(v) => setFilters((f) => ({ ...f, charges: v }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Indifférent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Indifférent</SelectItem>
          <SelectItem value="oui">Oui</SelectItem>
          <SelectItem value="non">Non</SelectItem>
        </SelectContent>
      </Select>

      <Label>Loyer max (€)</Label>
      <Input
        type="number"
        min={0}
        value={filters.loyerMax}
        onChange={(e) => setFilters((f) => ({ ...f, loyerMax: Number(e.target.value || 0) }))}
      />
    </div>
  );
}

function FiltersVente({ filters, setFilters }) {
  return (
    <div className="grid gap-3">
      <Label>Type de bien</Label>
      <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}>
        <SelectTrigger>
          <SelectValue placeholder="Tous" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="appartement">Appartement</SelectItem>
          <SelectItem value="maison">Maison</SelectItem>
          <SelectItem value="local">Local commercial</SelectItem>
        </SelectContent>
      </Select>

      <Label>Surface min (m²)</Label>
      <Input
        type="number"
        min={0}
        value={filters.surfaceMin}
        onChange={(e) => setFilters((f) => ({ ...f, surfaceMin: Number(e.target.value || 0) }))}
      />

      <Label>Prix max (€)</Label>
      <Input
        type="number"
        min={0}
        value={filters.prixMax}
        onChange={(e) => setFilters((f) => ({ ...f, prixMax: Number(e.target.value || 0) }))}
      />

      <Label>Occupé</Label>
      <Select value={filters.occupe} onValueChange={(v) => setFilters((f) => ({ ...f, occupe: v }))}>
        <SelectTrigger>
          <SelectValue placeholder="Indifférent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Indifférent</SelectItem>
          <SelectItem value="oui">Oui</SelectItem>
          <SelectItem value="non">Non</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("location");
  const [query, setQuery] = useState("");
  const [openItem, setOpenItem] = useState(null);

  const [locFilters, setLocFilters] = useState({
    meuble: "all",
    coloc: "all",
    chambresMin: 0,
    charges: "all",
    loyerMax: 0,
  });

  const [venFilters, setVenFilters] = useState({
    type: "all",
    surfaceMin: 0,
    prixMax: 0,
    occupe: "all",
  });

  const [role, setRole] = useState("locataire");

  const locList = useMemo(() => {
    return locationOffers.filter((o) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || o.titre.toLowerCase().includes(q) || o.ville.toLowerCase().includes(q);
      const byMeuble =
        locFilters.meuble === "all" || (locFilters.meuble === "meuble" ? o.meuble : !o.meuble);
      const byColoc = locFilters.coloc === "all" || (locFilters.coloc === "oui" ? o.colocation : !o.colocation);
      const byCh = o.chambres >= (locFilters.chambresMin || 0);
      const byCharges =
        locFilters.charges === "all" || (locFilters.charges === "oui" ? o.chargesIncluses : !o.chargesIncluses);
      const byLoyer = !locFilters.loyerMax || o.loyer <= locFilters.loyerMax;
      return matchesQuery && byMeuble && byColoc && byCh && byCharges && byLoyer;
    });
  }, [query, locFilters]);

  const venList = useMemo(() => {
    return venteOffers.filter((o) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || o.titre.toLowerCase().includes(q) || o.ville.toLowerCase().includes(q);
      const byType = venFilters.type === "all" || o.type === venFilters.type;
      const bySurf = o.surface >= (venFilters.surfaceMin || 0);
      const byPrix = !venFilters.prixMax || o.prix <= venFilters.prixMax;
      const byOcc = venFilters.occupe === "all" || (venFilters.occupe === "oui" ? o.occupe : !o.occupe);
      return matchesQuery && byType && bySurf && byPrix && byOcc;
    });
  }, [query, venFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">A</div>
            </motion.div>
            <div>
              <h1 className="text-xl font-semibold leading-tight">A kaz aw</h1>
              <p className="text-xs text-muted-foreground -mt-1">Annonces & Espace perso immobilier</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une ville, un titre…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" />Filtres</Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 w-full rounded-2xl">
            <TabsTrigger value="location" className="gap-2"><Home className="h-4 w-4" />Location</TabsTrigger>
            <TabsTrigger value="vente" className="gap-2"><Building2 className="h-4 w-4" />Vente</TabsTrigger>
            <TabsTrigger value="espace" className="gap-2"><User className="h-4 w-4" />Espace perso</TabsTrigger>
          </TabsList>

          {/* Location */}
          <TabsContent value="location" className="mt-6">
            <div className="grid grid-cols-12 gap-6">
              <aside className="col-span-12 md:col-span-3">
                <Card className="sticky top-20 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Filtres (location)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FiltersLocation filters={locFilters} setFilters={setLocFilters} />
                  </CardContent>
                </Card>
              </aside>

              <section className="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {locList.map((item) => (
                  <ListingCard key={item.id} item={item} kind="location" onOpen={setOpenItem} />
                ))}
                {locList.length === 0 && (
                  <Card className="col-span-full rounded-2xl">
                    <CardContent className="p-8 text-center text-muted-foreground">Aucune offre ne correspond à vos filtres.</CardContent>
                  </Card>
                )}
              </section>
            </div>
          </TabsContent>

          {/* Vente */}
          <TabsContent value="vente" className="mt-6">
            <div className="grid grid-cols-12 gap-6">
              <aside className="col-span-12 md:col-span-3">
                <Card className="sticky top-20 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Filtres (vente)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FiltersVente filters={venFilters} setFilters={setVenFilters} />
                  </CardContent>
                </Card>
              </aside>

              <section className="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {venList.map((item) => (
                  <ListingCard key={item.id} item={item} kind="vente" onOpen={setOpenItem} />
                ))}
                {venList.length === 0 && (
                  <Card className="col-span-full rounded-2xl">
                    <CardContent className="p-8 text-center text-muted-foreground">Aucun bien ne correspond à vos filtres.</CardContent>
                  </Card>
                )}
              </section>
            </div>
          </TabsContent>

          {/* Espace perso */}
          <TabsContent value="espace" className="mt-6">
            <div className="grid grid-cols-12 gap-6">
              <aside className="col-span-12 md:col-span-4">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Votre profil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Label>Je suis</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="locataire">Locataire</SelectItem>
                        <SelectItem value="loueur">Loueur / Bailleur</SelectItem>
                        <SelectItem value="vendeur">Vendeur</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                      <Info className="h-3.5 w-3.5" /> Sélectionnez votre rôle pour afficher les documents adaptés.
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Documents de loi (France)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {lawDocs.map((d) => (
                        <AccordionItem value={d.id} key={d.id}>
                          <AccordionTrigger>{d.titre}</AccordionTrigger>
                          <AccordionContent>{d.contenu}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </aside>

              <section className="col-span-12 md:col-span-8 grid gap-6">
                <Card className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Votre documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {role === "locataire" && (
                      <div className="grid gap-3">
                        <DocRow name="Quittances de loyer" actions={["consulter", "télécharger"]} />
                        <DocRow name="État des lieux (template)" actions={["remplir en ligne", "télécharger"]} />
                        <DocRow name="Contrat de location (bail)" actions={["prévisualiser", "télécharger"]} />
                      </div>
                    )}
                    {role === "loueur" && (
                      <div className="grid gap-3">
                        <DocRow name="Bail meublé / non meublé (modèles)" actions={["remplir en ligne", "télécharger"]} />
                        <DocRow name="État des lieux d'entrée/sortie" actions={["remplir en ligne", "télécharger"]} />
                        <DocRow name="Quittances (génération)" actions={["générer", "exporter pdf"]} />
                      </div>
                    )}
                    {role === "vendeur" && (
                      <div className="grid gap-3">
                        <DocRow name="Dossier de diagnostics techniques (DDT)" actions={["ajouter", "consulter"]} />
                        <DocRow name="Compromis / promesse de vente (modèle)" actions={["prévisualiser", "télécharger"]} />
                        <DocRow name="Acte de vente (référentiel)" actions={["consulter"]} />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">Chargez vos PDF, images ou docx</div>
                    <Button className="gap-2"><Upload className="h-4 w-4" />Importer un document</Button>
                  </CardFooter>
                </Card>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Drawer / Sheet for item details */}
      <Sheet open={!!openItem} onOpenChange={() => setOpenItem(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          {openItem && (
            <>
              <SheetHeader>
                <SheetTitle>{openItem.titre}</SheetTitle>
                <SheetDescription>
                  {openItem.ville} • Publié il y a {daysSince(openItem.datePublication)} jours
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="text-sm text-muted-foreground">{openItem.details}</div>
                <Card className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Historique des prix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PriceHistory data={openItem.history} />
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  {"loyer" in openItem ? (
                    <>
                      <InfoLine label="Loyer actuel" value={`${openItem.loyer} € /mois`} />
                      <InfoLine label="Surface" value={`${openItem.surface} m²`} />
                      <InfoLine label="Meublé" value={openItem.meuble ? "Oui" : "Non"} />
                      <InfoLine label="Colocation" value={openItem.colocation ? "Oui" : "Non"} />
                      <InfoLine label="Charges incluses" value={openItem.chargesIncluses ? "Oui" : "Non"} />
                    </>
                  ) : (
                    <>
                      <InfoLine label="Prix actuel" value={`${openItem.prix.toLocaleString("fr-FR")} €`} />
                      <InfoLine label="Surface" value={`${openItem.surface} m²`} />
                      <InfoLine label="Type" value={openItem.type} />
                      <InfoLine label="Construction" value={openItem.dateConstruction} />
                      <InfoLine label="Occupé" value={openItem.occupe ? "Oui" : "Non"} />
                      <InfoLine label="Taxe foncière" value={`${openItem.taxeFonciere} €`} />
                      {openItem.chargesCopro > 0 && (
                        <InfoLine label="Charges copro" value={`${openItem.chargesCopro} €`} />
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Contacter</Button>
                  <Button variant="outline" className="flex-1">Ajouter aux favoris</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} A kaz aw — Prototype UI
      </footer>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function DocRow({ name, actions = [] }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex gap-2">
        {actions.map((a) => (
          <Button key={a} size="sm" variant={a === "télécharger" || a === "exporter pdf" ? "outline" : "secondary"}>
            {a}
          </Button>
        ))}
      </div>
    </div>
  );
}
