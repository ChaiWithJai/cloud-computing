import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, (e) => {
	if (e) console.error(e);
	console.log(`Server listening on port ${PORT}`);
});
