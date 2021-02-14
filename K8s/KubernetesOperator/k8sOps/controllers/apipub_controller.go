/*


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controllers

import (
	"context"
	"fmt"

	"github.com/go-logr/logr"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	publishv1 "github.com/example-inc/api-publish-operator/api/v1"
)

// ApiPubReconciler reconciles a ApiPub object
type ApiPubReconciler struct {
	client.Client
	Log    logr.Logger
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=publish.example.com,resources=apipubs,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=publish.example.com,resources=apipubs/status,verbs=get;update;patch

func (r *ApiPubReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {
	ctx := context.Background()
	_ = r.Log.WithValues("apipub", req.NamespacedName)

	// get the hello pod
	pod := &corev1.Pod{}
	err := r.Client.Get(ctx, client.ObjectKey{
		Namespace: "default",
		Name:      "hello",
	}, pod)
	if err != nil {
		// create thepod if not presented
		pod = &corev1.Pod{
			ObjectMeta: metav1.ObjectMeta{
				Namespace: "default",
				Name:      "hello",
			},
			Spec: corev1.PodSpec{
				Containers: []corev1.Container{
					{
						Image:   "busybox:latest",
						Name:    "bbox-container",
						Command: []string{"sh", "-c", "echo \"hello world\" && date && sleep infinity"},
					},
				},
			},
		}
		err = r.Client.Create(context.Background(), pod)
		if err != nil {
			fmt.Printf("failed to delete the hello pod: %v\n", err)
			return ctrl.Result{}, err
		}
	} else {
		// delete the pod if it exists
		err = r.Client.Delete(ctx, pod)
		if err != nil {
			fmt.Printf("failed to delete the hello pod: %v\n", err)
			return ctrl.Result{}, err
		}
	}
	return ctrl.Result{}, nil
}

func (r *ApiPubReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&publishv1.ApiPub{}).
		Complete(r)
}
