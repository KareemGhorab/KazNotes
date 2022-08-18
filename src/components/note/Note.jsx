import Card from "react-bootstrap/Card";

function Note({ title, desc, id }) {
	return (
		<Card className="bg-warning shadow-lg text-black text-center py-5 px-3">
			<Card.Body>
				<Card.Title className="fs-2">{title}</Card.Title>
				<Card.Text>{desc}</Card.Text>
			</Card.Body>
		</Card>
	);
}

export default Note;
