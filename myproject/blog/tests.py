from django.test import TestCase, Client
from django.urls import reverse
from .models import Post


class PostModelTest(TestCase):
    def setUp(self):
        self.post = Post.objects.create(
            title='Test Post',
            content='Test content here.',
            published=True
        )

    def test_post_str(self):
        self.assertEqual(str(self.post), 'Test Post')

    def test_post_creation(self):
        self.assertEqual(self.post.title, 'Test Post')
        self.assertTrue(self.post.published)


class PostViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.post = Post.objects.create(
            title='Published Post',
            content='This is published.',
            published=True
        )
        self.unpublished = Post.objects.create(
            title='Draft Post',
            content='This is a draft.',
            published=False
        )

    def test_post_list_view(self):
        response = self.client.get(reverse('post_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Published Post')
        self.assertNotContains(response, 'Draft Post')

    def test_post_detail_view(self):
        response = self.client.get(reverse('post_detail', args=[self.post.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Published Post')
