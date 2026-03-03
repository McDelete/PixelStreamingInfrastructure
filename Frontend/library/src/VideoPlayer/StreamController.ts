// Copyright Epic Games, Inc. All Rights Reserved.

import { Logger } from '@epicgames-ps/lib-pixelstreamingcommon-ue5.7';
import { VideoPlayer } from './VideoPlayer';

/**
 * Video Player Controller handles the creation of the video HTML element and all handlers
 */
export class StreamController {
    videoElementProvider: VideoPlayer;
    videoStreams: MediaStream[] = [];
    activeVideoStreamIndex = -1;

    /**
     * @param videoElementProvider Video Player instance
     */
    constructor(videoElementProvider: VideoPlayer) {
        this.videoElementProvider = videoElementProvider;
    }

    /**
     * Handles when the Peer connection has a track event
     * @param rtcTrackEvent - RTC Track Event
     */
    handleOnTrack(rtcTrackEvent: RTCTrackEvent) {
        Logger.Info('handleOnTrack ' + JSON.stringify(rtcTrackEvent.streams));
        // Do not add the track if the ID is `probator` as this is special track created by mediasoup for bitrate probing.
        // Refer to https://github.com/EpicGamesExt/PixelStreamingInfrastructure/pull/86 for more details.
        if (rtcTrackEvent.streams.length < 1 || rtcTrackEvent.streams[0].id == 'probator') {
            return;
        }

        const videoElement = this.videoElementProvider.getVideoElement();

        if (rtcTrackEvent.track) {
            Logger.Info(
                'Got track - ' +
                    rtcTrackEvent.track.kind +
                    ' id=' +
                    rtcTrackEvent.track.id +
                    ' readyState=' +
                    rtcTrackEvent.track.readyState
            );
        }

        if (rtcTrackEvent.track.kind == 'video') {
            // TODO: When UE emits color/depth/other tracks, keep each output as a unique MediaStream id.
            const stream = rtcTrackEvent.streams[0];
            const existingIndex = this.videoStreams.findIndex(
                (existingStream) => existingStream.id === stream.id
            );
            if (existingIndex === -1) {
                this.videoStreams.push(stream);
                Logger.Info(
                    `Registered incoming video stream id=${stream.id} index=${this.videoStreams.length - 1}`
                );
            }

            if (this.activeVideoStreamIndex === -1) {
                this.setActiveVideoStreamByIndex(0);
                Logger.Info('Set video source from first incoming video track ontrack.');
                return;
            }

            const activeStream = this.getActiveVideoStream();
            if (activeStream && videoElement.srcObject !== activeStream) {
                videoElement.srcObject = activeStream;
            }
        }
    }

    setActiveVideoStreamByIndex(index: number): number {
        if (this.videoStreams.length < 1) {
            return -1;
        }

        const normalizedIndex =
            ((index % this.videoStreams.length) + this.videoStreams.length) % this.videoStreams.length;
        const stream = this.videoStreams[normalizedIndex];
        this.videoElementProvider.getVideoElement().srcObject = stream;
        this.activeVideoStreamIndex = normalizedIndex;
        Logger.Info(`Active video stream switched to index=${normalizedIndex} id=${stream.id}`);
        return normalizedIndex;
    }

    cycleToNextVideoStream(): number {
        if (this.videoStreams.length < 1) {
            return -1;
        }

        const nextIndex = this.activeVideoStreamIndex < 0 ? 0 : this.activeVideoStreamIndex + 1;
        return this.setActiveVideoStreamByIndex(nextIndex);
    }

    getVideoStreamsCount(): number {
        return this.videoStreams.length;
    }

    getActiveVideoStreamIndex(): number {
        return this.activeVideoStreamIndex;
    }

    getActiveVideoStream(): MediaStream | null {
        if (this.activeVideoStreamIndex < 0 || this.activeVideoStreamIndex >= this.videoStreams.length) {
            return null;
        }

        return this.videoStreams[this.activeVideoStreamIndex];
    }
}
