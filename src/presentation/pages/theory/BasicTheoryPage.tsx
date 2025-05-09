import React from 'react';
import { Box, Typography, Paper, Container, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../../common/Header';
import { pageLayout, mainContainer, breadcrumbsContainer, sectionPaper, diagramPlaceholder, theoryHeading, lastSectionPaper } from '../../../assets/styles/pages/pageStyles';
import MetricQueriesDiagrams from '../../components/diagrams/MetricQueriesDiagram';

/**
 * Component displaying the basics of metric methods theory page.
 * 
 * This component provides the foundational theoretical knowledge about metric methods.
 * It explains what metric methods are, why they're important, and introduces
 * the basic types of metric queries (Range Query, k-NN, Dynamic Insert).
 * 
 * The page is structured with:
 * - Introduction to metric methods
 * - Definition and concepts of metric methods
 * - Explanation of their importance and advantages
 * - Detailed descriptions of the three main types of metric queries with formal definitions
 * - Visual diagrams illustrating the query types
 * - Navigation links to more advanced theoretical topics
 * 
 * This serves as the entry point into the theoretical aspects of the application,
 * providing an accessible introduction for users new to the subject.
 * 
 * @returns {JSX.Element} React component with fundamental theory of metric methods
 */
const BasicTheoryPage: React.FC = () => {
  return (
    <Box sx={pageLayout}>
      <Header pageTitle="Základy metrických metod" />
      
      <Container maxWidth="lg" sx={mainContainer}>
        {/* Navigation */}
        <Breadcrumbs sx={breadcrumbsContainer}>
          <Link component={RouterLink} to="/">
            Domů
          </Link>
          <Link component={RouterLink} to="/theory">
            Teorie
          </Link>
          <Typography color="text.primary">Základy metrických metod</Typography>
        </Breadcrumbs>
        
        {/* Introduction */}
        <Paper sx={sectionPaper}>
          <Typography variant="h4" component="h1" gutterBottom>
            Základy metrických metod
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické metody představují důležitý přístup k indexaci a vyhledávání 
            v rozsáhlých datových sadách. Pojďme se podívat na jejich základní principy a význam.
          </Typography>
        </Paper>
        
        {/* What are metric methods */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            Co jsou metrické metody?
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické indexační metody jsou způsoby organizace dat, které využívají 
            konceptu vzdálenosti mezi objekty pro efektivní vyhledávání podobných prvků.
            Na rozdíl od tradičních indexačních metod, které pracují s přesnou shodou, 
            metrické metody umožňují vyhledávání na základě podobnosti.
          </Typography>
          <Typography variant="body1" paragraph>
            Základním předpokladem je, že máme definovanou metriku (vzdálenostní funkci),
            která dokáže kvantifikovat míru podobnosti mezi dvěma objekty. Objekty mohou
            být různé povahy: vektory, řetězce, obrazy, zvukové záznamy, atd.
          </Typography>
        </Paper>
        
        {/* Why they are important */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            Proč jsou metrické metody důležité?
          </Typography>
          <Typography variant="body1" paragraph>
            S nárůstem objemu dat a potřebou vyhledávat v nich na základě podobnosti se 
            tradiční sekvenční prohledávání stává neefektivním. Metrické metody nabízejí
            způsob, jak významně redukovat počet nutných porovnání.
          </Typography>
          <Typography variant="body1" paragraph>
            Hlavní výhody metrických metod:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <strong>Efektivita</strong> - Redukce počtu porovnání při zachování přesnosti výsledků
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Univerzálnost</strong> - Aplikovatelnost na libovolné datové typy, kde lze definovat metriku
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Adaptabilita</strong> - Možnost přizpůsobení konkrétním potřebám aplikace
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Přesnost</strong> - Garantované nalezení správných výsledků díky matematickým vlastnostem metrik
              </Typography>
            </li>
          </ul>
        </Paper>
        
        {/* Types of metric queries */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            Základní typy metrických dotazů
          </Typography>
          <Typography variant="body1" paragraph>
            Metrické metody typicky podporují následující typy dotazů:
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Range Query (Rozsahový dotaz)</Typography>
          <Typography variant="body1" paragraph>
            Nalezne všechny objekty v databázi, jejichž vzdálenost od dotazovacího objektu
            je menší nebo rovna zadanému prahu (poloměru). Formálně: 
            R(q, r) = {'{'} o ∈ DB | d(q, o) ≤ r {'}'}
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>k-NN Query (Dotaz k nejbližších sousedů)</Typography>
          <Typography variant="body1" paragraph>
            Nalezne k objektů v databázi, které jsou nejblíže dotazovacímu objektu.
            Formálně: kNN(q) = množina k objektů o ∈ DB takových, že neexistuje více než k-1 
            objektů o' ∈ DB, pro které platí d(q, o') &lt; d(q, o).
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Dynamic Insert (Dynamické vkládání)</Typography>
          <Typography variant="body1" paragraph>
            Umožňuje efektivně vložit nový objekt do existující struktury bez nutnosti
            kompletní reorganizace dat.
          </Typography>
          
          {/* Place for diagram */}
          <Box sx={diagramPlaceholder}>
            <Typography variant="body2" color="textSecondary">
              <MetricQueriesDiagrams/>
            </Typography>
          </Box>
        </Paper>
        
        {/* Links to other sections - last section without bottom margin */}
        <Paper sx={lastSectionPaper}>
          <Typography variant="h5" gutterBottom>
            Další teoretické sekce
          </Typography>
          <Typography variant="body1" paragraph>
            Pro hlubší pochopení principů metrických metod pokračujte na následující sekce:
          </Typography>
          <ul>
            <li>
              <Link component={RouterLink} to="/theory/metric-space">
                <Typography variant="body1">Metrický prostor a metrika</Typography>
              </Link>
            </li>
            <li>
              <Link component={RouterLink} to="/theory/key-principles">
                <Typography variant="body1">Klíčové vlastnosti a principy metrických metod</Typography>
              </Link>
            </li>
          </ul>
        </Paper>
      </Container>
    </Box>
  );
};

export default BasicTheoryPage;