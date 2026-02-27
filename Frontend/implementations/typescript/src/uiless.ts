// Copyright Epic Games, Inc. All Rights Reserved.

import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.7';

document.body.onload = function() {
	const config = new Config({
		initialSettings: {
			AutoConnect: true,
			AutoPlayVideo: true,
			WaitForStreamer: true,
			StartVideoMuted: true,
			KeyboardInput: true,
			MouseInput: true,
			TouchInput: true,
			GamepadInput: true
		}
	});

	new PixelStreaming(config, { videoElementParent: document.getElementById('videoParentElement') });
};
