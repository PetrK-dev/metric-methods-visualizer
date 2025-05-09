import React from 'react';
import { Box, Typography, Paper, Container, Breadcrumbs, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../../common/Header';
import { pageLayout, mainContainer, sectionPaper, diagramPlaceholder, largePlaceholder, lastSectionPaper, breadcrumbsContainer, theoryHeading } from '../../../assets/styles/pages/pageStyles';

/**
 * Component displaying the key principles and properties of metric methods.
 * 
 * This component describes the fundamental principles that enable metric methods
 * to efficiently index and search data, focusing on four main aspects:
 * 1. Effective modeling of relationships between objects
 * 2. Using metric axioms (especially triangle inequality) for object filtering
 * 3. Optimization of computationally expensive metrics
 * 4. Effectiveness in spaces with reasonable dimensionality
 * 
 * The page provides in-depth explanations of these concepts, including:
 * - How distance functions model semantic relationships between objects
 * - How the triangle inequality enables efficient object elimination
 * - Various strategies for minimizing distance computations
 * - The "curse of dimensionality" and its impact on metric methods
 * 
 * This page is aimed at users who already understand the basics and want
 * to deepen their understanding of how metric methods work internally.
 * 
 * @returns {JSX.Element} React component with key principles of metric methods
 */
const KeyPrinciplesPage: React.FC = () => {
  return (
    <Box sx={pageLayout}>
      <Header pageTitle="Klíčové vlastnosti a principy" />
      
      <Container maxWidth="lg" sx={mainContainer}>
        {/* Navigation */}
        <Breadcrumbs sx={breadcrumbsContainer}>
          <Link component={RouterLink} to="/">
            Domů
          </Link>
          <Link component={RouterLink} to="/theory">
            Teorie
          </Link>
          <Typography color="text.primary">Klíčové vlastnosti a principy</Typography>
        </Breadcrumbs>
        
        {/* Introduction */}
        <Paper sx={sectionPaper}>
          <Typography variant="h4" component="h1" gutterBottom>
            Klíčové vlastnosti a principy metrických metod
          </Typography>
          <Typography variant="body1" paragraph>
            V této sekci se podíváme na hlavní principy, které umožňují metrickým metodám
            efektivně indexovat a vyhledávat data. Projdeme si modelování vztahů mezi objekty,
            využití trojúhelníkové nerovnosti, optimalizaci výpočtů a omezení metrických metod.
          </Typography>
        </Paper>
        
        {/* Modeling relationships between objects */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            1. Efektivní modelování vztahů mezi objekty
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické metody jsou založeny na předpokladu, že vzdálenostní funkce (metrika)
            dobře modeluje sémantické vztahy mezi objekty - podobné objekty mají malou
            vzdálenost a nepodobné velkou.
          </Typography>
          <Typography variant="body1" paragraph>
            Důležité aspekty modelování vztahů:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <strong>Vhodná reprezentace objektů</strong> - objekty musí být reprezentovány tak,
                aby metrika mezi nimi odrážela jejich skutečnou podobnost
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Správná volba metriky</strong> - různé aplikace mohou vyžadovat různé
                metriky pro zachycení relevantních aspektů podobnosti
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Shlukování podobných objektů</strong> - metrické metody přirozeně
                seskupují podobné objekty, což umožňuje efektivní prořezávání při vyhledávání
              </Typography>
            </li>
          </ul>
        </Paper>
        
        {/* Using metric axioms */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            2. Využití axiomů metriky pro filtraci objektů
          </Typography>
          <Typography variant="body1" paragraph>
            Klíčovou vlastností, která umožňuje efektivitu metrických metod, je 
            trojúhelníková nerovnost. Ta poskytuje způsob, jak vyloučit objekty z vyhledávání
            bez nutnosti výpočtu jejich přesné vzdálenosti od dotazu.
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Princip eliminace pomocí dolní meze</Typography>
          <Typography variant="body1" paragraph>
            Pro libovolné objekty q (dotaz), p (pivot) a o (objekt v databázi) platí:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'monospace', pl: 2 }}>
            |d(q, p) - d(p, o)| ≤ d(q, o) ≤ d(q, p) + d(p, o)
          </Typography>
          <Typography variant="body1" paragraph>
            Z toho vyplývá, že |d(q, p) - d(p, o)| je dolní mezí vzdálenosti d(q, o).
            Pokud je tato dolní mez větší než poloměr dotazu, objekt o nemůže být ve výsledku.
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Praktické využití</Typography>
          <Typography variant="body1" paragraph>
            Při rozsahovém dotazu s poloměrem r: Pokud |d(q, p) - d(p, o)| {'>'} r, 
            pak objekt o nemůže být ve výsledku a můžeme ho vyloučit bez výpočtu d(q, o).
          </Typography>
          <Typography variant="body1" paragraph>
            Při kNN dotazu: Jakmile máme k kandidátů a aktuální k-tý nejbližší má vzdálenost dk,
            můžeme vyloučit všechny objekty o, pro které platí |d(q, p) - d(p, o)| {'>'} dk.
          </Typography>
        </Paper>
        
        {/* Optimization of computations */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            3. Optimalizace výpočetně náročných metrik
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické metody se snaží minimalizovat počet volání distanční funkce,
            která může být výpočetně náročná (např. pro komplexní objekty jako obrázky).
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Strategie optimalizace</Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <strong>Předpočítání vzdáleností</strong> - AESA předpočítává vzdálenosti mezi všemi objekty,
                což umožňuje maximální využití dolních mezí, ale má kvadratickou paměťovou náročnost
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Využití pivotů</strong> - LAESA optimalizuje paměť použitím jen omezeného počtu
                pivotů pro předpočítání vzdáleností
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Hierarchické indexování</strong> - M-Tree organizuje data do stromové struktury,
                což umožňuje efektivní prořezávání při vyhledávání
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Více dolních mezí</strong> - Kombinace více dolních mezí pro přesnější filtraci objektů
              </Typography>
            </li>
          </ul>
        </Paper>
        
        {/* Curse of dimensionality */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            4. Efektivita v prostorech s přiměřenou dimenzionalitou
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické metody, podobně jako jiné indexační techniky, trpí tzv. "prokletím dimenze"
            - s rostoucím počtem dimenzí klesá jejich efektivita.
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Co je prokletí dimenze?</Typography>
          <Typography variant="body1" paragraph>
            S rostoucí dimenzionalitou prostoru se:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Objemy zvětšují exponenciálně
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Data stávají řídkými (sparse)
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Rozdíly mezi vzdálenostmi vyrovnávají (všechny body jsou si "podobně vzdálené")
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Účinnost filtrování pomocí trojúhelníkové nerovnosti snižuje
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" sx={theoryHeading}>Optimální použití metrických metod</Typography>
          <Typography variant="body1" paragraph>
            Metrické metody jsou nejefektivnější v prostorech s přiměřenou dimenzí (cca do 10-20 dimenzí)
            a s výpočetně náročnou metrikou. Pokud je metrika jednoduchá nebo dimenze příliš vysoká,
            může být výhodnější jiný přístup.
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Strategie pro vysokodimenzionální data</Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Redukce dimenzionality (PCA, t-SNE, atd.)
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Aproximativní vyhledávání (např. locality-sensitive hashing)
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Kombinace s jinými technikami
              </Typography>
            </li>
          </ul>
        </Paper>
        
        {/* Links to other sections */}
        <Paper sx={lastSectionPaper}>
            <Typography variant="h5" gutterBottom>
            Další teoretické sekce
            </Typography>
            <Typography variant="body1" paragraph>
            Pro hlubší pochopení principů metrických metod pokračujte na následující sekce:
            </Typography>
            <ul>
                <li>
                    <Link component={RouterLink} to="/theory/basics">
                    <Typography variant="body1">Základy metrických metod</Typography>
                    </Link>
                </li>
                <li>
                    <Link component={RouterLink} to="/theory/metric-space">
                    <Typography variant="body1">Metrický prostor a metrika</Typography>
                    </Link>
                </li>
            </ul>
        </Paper>
      </Container>
    </Box>
  );
};

export default KeyPrinciplesPage;