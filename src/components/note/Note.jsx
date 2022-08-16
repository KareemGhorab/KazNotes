import { useId } from "react";
import Card from "react-bootstrap/Card";

function Note({ title, desc }) {
	return (
		<Card className="text-black text-center py-5 ">
			<Card.Body>
				<Card.Title className="fs-2">{title}</Card.Title>
				<Card.Text>{desc}</Card.Text>
			</Card.Body>
		</Card>
	);
}

export default Note;
