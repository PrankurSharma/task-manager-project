import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails } from '@mui/material';


interface AccordionWrapperProps {
    title: string;
    children: React.ReactElement
}

export default function AccordionWrapper({ title, children }: AccordionWrapperProps) {
    return <Accordion defaultExpanded>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
        >
            <Typography component="span">{title}</Typography>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </AccordionSummary>
    </Accordion>
}   