// Copyright © 2019 The Things Network Foundation, The Things Industries B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package io

import (
	"context"
	"time"

	"go.thethings.network/lorawan-stack/pkg/config"
	"go.thethings.network/lorawan-stack/pkg/errors"
	"go.thethings.network/lorawan-stack/pkg/log"
	"go.thethings.network/lorawan-stack/pkg/random"
	"go.thethings.network/lorawan-stack/pkg/ttnpb"
)

// RetryServer is a server that attempts to automatically re-subscribe to the upstream server by
// proxying Subscription objects.
type RetryServer struct {
	upstream Server
}

// NewRetryServer creates a new RetryServer with the given upstream.
func NewRetryServer(upstream Server) Server {
	return &RetryServer{
		upstream: upstream,
	}
}

// GetBaseConfig implements Server using the upstream Server.
func (rs RetryServer) GetBaseConfig(ctx context.Context) config.ServiceBase {
	return rs.upstream.GetBaseConfig(ctx)
}

// FillContext implements Server using the upstream Server.
func (rs RetryServer) FillContext(ctx context.Context) context.Context {
	return rs.upstream.FillContext(ctx)
}

// SendUp implements Server using the upstream Server.
func (rs RetryServer) SendUp(ctx context.Context, up *ttnpb.ApplicationUp) error {
	return rs.upstream.SendUp(ctx, up)
}

var retryBackoff = []time.Duration{100 * time.Millisecond, 1 * time.Second, 10 * time.Second}

const backoffJitter = 0.15

// Subscribe implements Server by proxying the Subscription object betwen the upstream server and the frontend.
func (rs RetryServer) Subscribe(ctx context.Context, protocol string, ids ttnpb.ApplicationIdentifiers) (*Subscription, error) {
	downstreamSub := NewSubscription(ctx, protocol, &ids)
	upstreamSub, err := rs.upstream.Subscribe(ctx, protocol, ids)
	if err != nil {
		return nil, err
	}
	go func() {
		logger := log.FromContext(ctx)
	nextUp:
		for {
			select {
			case up := <-upstreamSub.Up():
				{
					err := downstreamSub.SendUp(up.Context, up.ApplicationUp)
					if err != nil {
						logger.WithError(err).Error("Failed to send the uplink downstream")
					}
				}
			case <-upstreamSub.Context().Done():
				{
					err := upstreamSub.Context().Err()
					if errors.IsCanceled(err) {
						for _, backoff := range retryBackoff {
							upstreamSub, err = rs.upstream.Subscribe(ctx, protocol, ids)
							if err == nil {
								continue nextUp
							}
							time.Sleep(random.Jitter(backoff, backoffJitter))
						}
					}
					downstreamSub.Disconnect(err)
					return
				}
			case up := <-downstreamSub.Up():
				{
					err := upstreamSub.SendUp(up.Context, up.ApplicationUp)
					if err != nil {
						logger.WithError(err).Error("Failed to send the uplink upstream")
					}
				}
			case <-downstreamSub.Context().Done():
				{
					err := downstreamSub.Context().Err()
					upstreamSub.Disconnect(err)
					return
				}
			}
		}
	}()
	return downstreamSub, nil
}

// DownlinkQueuePush implements Server using the upstream Server.
func (rs RetryServer) DownlinkQueuePush(ctx context.Context, ids ttnpb.EndDeviceIdentifiers, downlinks []*ttnpb.ApplicationDownlink) error {
	return rs.upstream.DownlinkQueuePush(ctx, ids, downlinks)
}

// DownlinkQueueReplace implements Server using the upstream Server.
func (rs RetryServer) DownlinkQueueReplace(ctx context.Context, ids ttnpb.EndDeviceIdentifiers, downlinks []*ttnpb.ApplicationDownlink) error {
	return rs.upstream.DownlinkQueueReplace(ctx, ids, downlinks)
}

// DownlinkQueueList implements Server using the upstream Server.
func (rs RetryServer) DownlinkQueueList(ctx context.Context, ids ttnpb.EndDeviceIdentifiers) ([]*ttnpb.ApplicationDownlink, error) {
	return rs.upstream.DownlinkQueueList(ctx, ids)
}
