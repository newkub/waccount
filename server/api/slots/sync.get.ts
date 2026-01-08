export default defineEventHandler(async (event) => {
	const { userId, projectContext } = getQuery(event);

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: "userId is required",
		});
	}

	setHeader(event, "Content-Type", "text/event-stream");
	setHeader(event, "Cache-Control", "no-cache");
	setHeader(event, "Connection", "keep-alive");

	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();

			const sendEvent = (data: any) => {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
			};

			sendEvent({ type: "connected", timestamp: new Date().toISOString() });

			const interval = setInterval(() => {
				sendEvent({ type: "ping", timestamp: new Date().toISOString() });
			}, 30000);

			event.node.req.on("close", () => {
				clearInterval(interval);
				controller.close();
			});
		},
	});

	return new Response(stream);
});
