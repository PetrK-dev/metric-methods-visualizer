// src/pages/AboutPage.tsx
import React from 'react';
import { Box, Typography, Paper, Container, Breadcrumbs, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../../common/Header';
import { pageLayout } from '../../../assets/styles/pages/pageStyles';

/**
 * About Page component that provides detailed information about the application.
 * 
 * The "About" page serves as documentation and help for users, explaining the 
 * purpose, usage, visualizations, and implemented methods of the application.
 * 
 * This page includes the following sections:
 * - Introduction with general application description
 * - User guide with explanation of controls and features
 * - Explanation of color coding and symbols used in visualizations
 * - Details about implemented metric methods (AESA, LAESA, M-Tree)
 * - Description of algorithm types (kNN, range query, dynamic insertion)
 * - Project information and credits
 * 
 * @returns {JSX.Element} Complete page with information about the application
 */
const AboutPage: React.FC = () => {
  return (
    <Box sx={pageLayout}>
      <Header pageTitle="O aplikaci" />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* Navigation breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/">
            Domů
          </Link>
          <Typography color="text.primary">O aplikaci</Typography>
        </Breadcrumbs>
        
        {/* Introduction section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            O aplikaci metrických metod
          </Typography>
          <Typography variant="body1" paragraph>
            Tato aplikace je interaktivním nástrojem pro vizualizaci a pochopení principů
            metrických indexačních metod. Umožňuje prozkoumat, jak fungují algoritmy AESA, 
            LAESA a M-Tree při vyhledávání podobných objektů v metrickém prostoru.
          </Typography>
        </Paper>
        
        {/* How to use the application section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Jak používat aplikaci
          </Typography>
          <Typography variant="body1" paragraph>
            Aplikace umožňuje krokovat algoritmy při různých typech dotazů a sledovat, 
            jak probíhá metrické vyhledávání. Zde je stručný návod k použití:
          </Typography>
          
          {/* Grid with instructions */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Základní ovládací prvky
              </Typography>
              <Box sx={{ pl: 2, borderLeft: '4px solid #2196f3' }}>
                <Typography variant="body1" paragraph>
                  <strong>Restart:</strong> Resetuje algoritmus na počáteční stav
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Pause:</strong> Pozastaví běžící animaci algoritmu
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Play:</strong> Spustí automatickou animaci algoritmu
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Step:</strong> Posune algoritmus o jeden krok vpřed
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Výběr algoritmů a parametrů
              </Typography>
              <Box sx={{ pl: 2, borderLeft: '4px solid #2196f3' }}>
                <Typography variant="body1" paragraph>
                  <strong>Výběr algoritmu:</strong> Umožňuje přepínat mezi typy algoritmů (kNN, rozsahový dotaz, dynamické vkládání)
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Úprava dotazovacího bodu:</strong> Můžete změnit souřadnice dotazovacího bodu
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Parametry algoritmů:</strong> U kNN dotazu můžete nastavit hodnotu k, u rozsahového dotazu poloměr
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Visualization explanation section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Vysvětlení vizualizace
          </Typography>
          <Typography variant="body1" paragraph>
            Vizualizace algoritmů používá konzistentní barevné značení a symboly:
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Barvy a symboly bodů
              </Typography>
              <Box sx={{ pl: 2, borderLeft: '4px solid #4caf50' }}>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#0000ff' }}>Modrý bod (Q):</strong> Dotazovací bod
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#ff00ff' }}>Fialový bod (P):</strong> Pivotní bod
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#000000' }}>Černý bod (O):</strong> Standardní objekt
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#00ff00' }}>Zelený bod:</strong> Aktuálně aktivní bod
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#888888' }}>Šedý bod:</strong> Eliminovaný bod
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#55FFF5' }}>Tyrkysový bod:</strong> Výsledný bod (patřící do výsledku dotazu)
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Čáry a kružnice
              </Typography>
              <Box sx={{ pl: 2, borderLeft: '4px solid #ff9800' }}>
                <Typography variant="body1" paragraph>
                  <strong>Plná čára:</strong> Vypočtená vzdálenost
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Přerušovaná čára:</strong> Odhad nebo dolní mez vzdálenosti
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#4caf50' }}>Zelená:</strong> Pozitivní výsledek (objekt patří do výsledku nebo nebude eliminován )
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#f44336' }}>Červená:</strong> Negativní výsledek (objekt eliminován)
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#2196f3' }}>Modrá:</strong> Dolní mez pro filtraci (lower bounding)
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#ff9800' }}>Oranžová:</strong> Rozsahový dotaz nebo hranice k-NN
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong style={{ color: '#9e9e9e' }}>Šedá:</strong> Region v M-Tree struktuře
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Implemented methods section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Implementované metody
          </Typography>
          <Typography variant="body1" paragraph>
            Aplikace implementuje tři základní metrické metody. Každá má své specifické vlastnosti a výhody:
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>AESA (Approximating Eliminating Search Algorithm)</Typography>
          <Typography variant="body1" paragraph>
            AESA je jedna z nejefektivnějších metrických metod z hlediska počtu výpočtů vzdálenosti.
            Předpočítává vzdálenosti mezi všemi objekty v databázi, což umožňuje maximální využití
            dolních mezí. Má však kvadratickou paměťovou složitost O(n²), což ji činí nevhodnou
            pro velké databáze.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>LAESA (Linear AESA)</Typography>
          <Typography variant="body1" paragraph>
            LAESA je optimalizovanou verzí AESA, která redukuje paměťovou složitost na O(kn),
            kde k je počet pivotů. Místo předpočítání všech vzdáleností uchovává pouze
            vzdálenosti k vybraným pivotním bodům. To přináší kompromis mezi efektivitou
            vyhledávání a paměťovou náročností.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>M-Tree</Typography>
          <Typography variant="body1" paragraph>
            M-Tree je dynamická stromová struktura optimalizovaná pro metrické prostory.
            Organizuje data hierarchicky, což umožňuje efektivní prořezávání při vyhledávání.
            Na rozdíl od AESA a LAESA podporuje efektivní dynamické operace (vkládání, mazání)
            a je vhodná pro persistentní ukládání dat.
          </Typography>
        </Paper>
        
        {/* Algorithm types section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Typy algoritmů
          </Typography>
          <Typography variant="body1" paragraph>
            Pro každou metrickou metodu jsou implementovány následující typy algoritmů:
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>kNN dotaz (k-Nearest Neighbors)</Typography>
          <Typography variant="body1" paragraph>
            Vyhledá k nejbližších sousedů k dotazovacímu bodu. Algoritmus postupně eliminuje objekty,
            které nemohou patřit mezi k nejbližších, a udržuje aktuální množinu kandidátů.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>Rozsahový dotaz (Range Query)</Typography>
          <Typography variant="body1" paragraph>
            Nalezne všechny objekty, jejichž vzdálenost od dotazovacího bodu je menší nebo rovna
            zadanému poloměru. Algoritmus využívá trojúhelníkovou nerovnost k eliminaci objektů,
            které nemohou být v zadaném dosahu.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>Dynamické vkládání (Dynamic Insert)</Typography>
          <Typography variant="body1" paragraph>
            Vloží nový objekt do existující struktury. Zajímavé především u M-Tree, kde je potřeba
            udržovat stromovou strukturu, ale implementováno pro všechny metody pro srovnání.
          </Typography>
        </Paper>

        {/* Data structures section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Datové struktury
          </Typography>
          <Typography variant="body1" paragraph>
            Aplikace využívá dvě základní datové struktury pro reprezentaci metod:
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>Matice vzdáleností (Distance Matrix)</Typography>
          <Typography variant="body1" paragraph>
            Matice vzdáleností je struktura používaná metodami AESA a LAESA. Ukládá předpočítané 
            vzdálenosti mezi body v metrickém prostoru. V případě AESA obsahuje vzdálenosti mezi 
            všemi dvojicemi bodů (kompletní matice), zatímco u LAESA pouze vzdálenosti mezi pivoty 
            a ostatními body (částečná matice). Díky této struktuře lze efektivně používat dolní 
            odhady vzdáleností bez nutnosti jejich výpočtu za běhu algoritmu.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>Stromová struktura (Tree)</Typography>
          <Typography variant="body1" paragraph>
            Strom organizuje body hierarchicky ve stromové struktuře, která obsahuje dva typy uzlů:
          </Typography>
          
          <Box sx={{ pl: 2, borderLeft: '4px solid #2196f3', mb: 2 }}>
            <Typography variant="body1" paragraph>
              <strong>Směrovací uzly (Routing Nodes):</strong> Vnitřní uzly stromu, které obsahují směrovací záznamy. 
              Každý směrovací záznam se skládá z pivotního bodu, poloměru pokrytí (maximální vzdálenost 
              od pivota k jakémukoliv bodu v podstromu) a odkazu na podstrom.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Listové uzly (Leaf Nodes):</strong> Koncové uzly stromu, které obsahují datové záznamy.
              Každý datový záznam obsahuje samotný bod a jeho vzdálenost od rodičovského pivotu.
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            Díky hierarchické struktuře a využití pokrývacích regionů umožňuje M-Tree efektivní 
            filtrování velkých částí prostoru během vyhledávání a podporuje dynamické operace 
            jako je vkládání a mazání bodů.
          </Typography>
        </Paper>
        
        {/* Project information section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            O projektu
          </Typography>
          <Typography variant="body1" paragraph>
            Tato aplikace byla vytvořena jako výukový nástroj pro lepší pochopení
            principů metrických indexačních metod. Je postavena na technologiích React,
            TypeScript a Material-UI.
          </Typography>
          <Typography variant="body1" paragraph>
            Aplikace implementuje tři základní metrické metody (AESA, LAESA, M-Tree)
            a tři typy dotazů (kNN, rozsahový, dynamické vkládání). Vizualizace krok
            po kroku umožňuje sledovat, jak algoritmy fungují, a lépe pochopit principy
            metrického vyhledávání.
          </Typography>
          
          {/* Author information and version */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
            Autor: [Kostelník Petr]
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Datum: 2025
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Verze: 1.0.0
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;