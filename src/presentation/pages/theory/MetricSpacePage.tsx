import React from 'react';
import { Box, Typography, Paper, Container, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../../common/Header';
import { pageLayout, mainContainer, sectionPaper, diagramPlaceholder, theorySidebar, largePlaceholder, lastSectionPaper, breadcrumbsContainer, theoryHeading } from '../../../assets/styles/pages/pageStyles';
import MetricFunctionsDiagram from '../../components/diagrams/MetricFunctionDiagram';
import MetricAxiomsDiagram from '../../components/diagrams/MetricAxiomsDiagram';

/**
 * Component displaying the theory of metric spaces and metrics.
 * 
 * This component explains the fundamental mathematical concepts of metric spaces
 * and metrics. It describes the formal definition of a metric space, the axioms
 * of a metric (non-negativity, identity, symmetry, triangle inequality), and
 * provides examples of common metrics (Euclidean, Manhattan, Hamming, Levenshtein).
 * 
 * The page contains:
 * - Definition and examples of metric spaces
 * - Detailed explanation of the four metric axioms with visual representations
 * - Examples of commonly used distance functions (metrics) with their formulas
 * - Diagrams illustrating the concepts of metrics and their properties
 * 
 * This page provides the mathematical foundation necessary for understanding
 * how metric methods work and why they guarantee correct results.
 * 
 * @returns {JSX.Element} React component with metric space theory
 */
const MetricSpacePage: React.FC = () => {
  return (
    <Box sx={pageLayout}>
      <Header pageTitle="Metrický prostor a metrika" />
      
      <Container maxWidth="lg" sx={mainContainer}>
        {/* Navigation */}
        <Breadcrumbs sx={breadcrumbsContainer}>
          <Link component={RouterLink} to="/">
            Domů
          </Link>
          <Link component={RouterLink} to="/theory">
            Teorie
          </Link>
          <Typography color="text.primary">Metrický prostor a metrika</Typography>
        </Breadcrumbs>
        
        {/* Introduction */}
        <Paper sx={sectionPaper}>
          <Typography variant="h4" component="h1" gutterBottom>
            Metrický prostor a metrika
          </Typography>
          <Typography variant="body1" paragraph>
            Základním stavebním kamenem všech metrických metod je koncept metrického prostoru
            a metriky (vzdálenostní funkce). Tato sekce vysvětluje tyto pojmy a jejich význam.
          </Typography>
        </Paper>
        
        {/* Definition of metric space */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            Co je metrický prostor?
          </Typography>
          <Typography variant="body1" paragraph>
            Metrický prostor je matematická struktura tvořená množinou objektů a funkcí,
            která měří vzdálenost mezi těmito objekty. Formálně je definován jako dvojice (X, d),
            kde X je množina a d je metrika na X.
          </Typography>
          <Typography variant="body1" paragraph>
            Příklady metrických prostorů:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Euklidovský prostor R<sup>n</sup> s euklidovskou vzdáleností
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Prostor řetězců s Levenštejnovou vzdáleností
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Prostor obrázků s vhodnou vzdálenostní funkcí
              </Typography>
            </li>
          </ul>
        </Paper>
        
        {/* Metric axioms */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            Axiomy metriky
          </Typography>
          <Typography variant="body1" paragraph>
            Aby funkce d: X × X → R byla metrikou, musí splňovat následující axiomy
            pro všechny x, y, z ∈ X:
          </Typography>
          
          <Box sx={theorySidebar}>
            <Typography variant="body1" fontWeight="bold" paragraph>
              1. Nezápornost
            </Typography>
            <Typography variant="body1" paragraph>
              d(x, y) ≥ 0
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, fontStyle: 'italic' }}>
              Vzdálenost mezi dvěma body nemůže být záporná.
            </Typography>
          </Box>
          
          <Box sx={theorySidebar}>
            <Typography variant="body1" fontWeight="bold" paragraph>
              2. Identita
            </Typography>
            <Typography variant="body1" paragraph>
              d(x, y) = 0 právě když x = y
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, fontStyle: 'italic' }}>
              Vzdálenost bodu od sebe sama je nula, a pouze v tomto případě je vzdálenost nulová.
            </Typography>
          </Box>
          
          <Box sx={theorySidebar}>
            <Typography variant="body1" fontWeight="bold" paragraph>
              3. Symetrie
            </Typography>
            <Typography variant="body1" paragraph>
              d(x, y) = d(y, x)
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, fontStyle: 'italic' }}>
              Vzdálenost z bodu A do bodu B je stejná jako z bodu B do bodu A.
            </Typography>
          </Box>
          
          <Box sx={theorySidebar}>
            <Typography variant="body1" fontWeight="bold" paragraph>
              4. Trojúhelníková nerovnost
            </Typography>
            <Typography variant="body1" paragraph>
              d(x, z) ≤ d(x, y) + d(y, z)
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, fontStyle: 'italic' }}>
              Přímá cesta z bodu A do bodu C je vždy kratší nebo stejně dlouhá jako cesta přes bod B.
            </Typography>
          </Box>
          
          {/* Place for diagram */}
          <Box sx={largePlaceholder}>
            <Typography variant="body2" color="textSecondary">
              <MetricAxiomsDiagram/>
            </Typography>
          </Box>
        </Paper>
        
        {/* Examples of metrics */}
        <Paper sx={sectionPaper}>
          <Typography variant="h5" gutterBottom>
            Příklady běžných metrik
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Euklidovská vzdálenost</Typography>
          <Typography variant="body1" paragraph>
            Pro body x = (x₁, x₂, ..., xₙ) a y = (y₁, y₂, ..., yₙ) v n-rozměrném prostoru:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'monospace', pl: 2 }}>
            d(x, y) = √((x₁ - y₁)² + (x₂ - y₂)² + ... + (xₙ - yₙ)²)
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Manhattanská vzdálenost (L₁ norma)</Typography>
          <Typography variant="body1" paragraph>
            Pro body x = (x₁, x₂, ..., xₙ) a y = (y₁, y₂, ..., yₙ) v n-rozměrném prostoru:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'monospace', pl: 2 }}>
            d(x, y) = |x₁ - y₁| + |x₂ - y₂| + ... + |xₙ - yₙ|
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Hammingova vzdálenost</Typography>
          <Typography variant="body1" paragraph>
            Pro řetězce stejné délky: počet pozic, ve kterých se řetězce liší.
          </Typography>
          <Typography variant="body1" paragraph>
            Příklad: Hammingova vzdálenost mezi řetězci "karavan" a "parabola" je 4.
          </Typography>
          
          <Typography variant="h6" sx={theoryHeading}>Levenštejnova vzdálenost</Typography>
          <Typography variant="body1" paragraph>
            Minimální počet operací (vložení, smazání, substituce), kterými lze transformovat
            jeden řetězec na druhý.
          </Typography>
          <Typography variant="body1" paragraph>
            Příklad: Levenštejnova vzdálenost mezi řetězci "kitten" a "sitting" je 3.
          </Typography>
          
          {/* Place for diagram */}
          <Box sx={diagramPlaceholder}>
            <Typography variant="body2" color="textSecondary">
              <MetricFunctionsDiagram/>
            </Typography>
          </Box>
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

export default MetricSpacePage;