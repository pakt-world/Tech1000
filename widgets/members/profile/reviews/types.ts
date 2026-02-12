export interface ReviewProps {
	body: string;
	title: string;
	rating: number;
	date: string | undefined;
	user: {
		_id: string | undefined;
		name: string;
		title: string;
		afroScore: number | undefined;
		avatar: string;
	};
	index?: string;
}
