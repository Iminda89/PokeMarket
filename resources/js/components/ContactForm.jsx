import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function ContactForm() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-4 shadow-sm bg-light rounded">
            <Form.Group className="mb-3">
                <Form.Label>Izena</Form.Label>
                <Form.Control required type="text" placeholder="Zure izena..." />
                <Form.Control.Feedback type="invalid">Mesedez, idatzi zure izena.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Posta elektronikoa</Form.Label>
                <Form.Control required type="email" placeholder="email@adibidea.com" />
                <Form.Control.Feedback type="invalid">Email baliozkoa behar da.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Mezua</Form.Label>
                <Form.Control required as="textarea" rows={3} />
            </Form.Group>

            <Button type="submit" variant="primary">Bidali</Button>
        </Form>
    );
}
export default ContactForm;