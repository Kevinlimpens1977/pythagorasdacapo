import unittest

from notebooklm_upload_and_generate import should_abort_source_stage


class NotebookLMUploadPolicyTest(unittest.TestCase):
    def test_non_production_allows_existing_lenient_behavior(self):
        abort, reason = should_abort_source_stage(
            production_mode=False,
            upload_results=[False],
            source_count=0,
            sources_ready=False,
        )

        self.assertFalse(abort)
        self.assertEqual(reason, "")

    def test_production_aborts_when_any_upload_fails(self):
        abort, reason = should_abort_source_stage(
            production_mode=True,
            upload_results=[True, False],
            source_count=2,
            sources_ready=True,
        )

        self.assertTrue(abort)
        self.assertEqual(reason, "upload_failed")

    def test_production_aborts_when_notebook_has_zero_sources(self):
        abort, reason = should_abort_source_stage(
            production_mode=True,
            upload_results=[True],
            source_count=0,
            sources_ready=True,
        )

        self.assertTrue(abort)
        self.assertEqual(reason, "zero_sources")

    def test_production_aborts_when_source_processing_times_out(self):
        abort, reason = should_abort_source_stage(
            production_mode=True,
            upload_results=[True],
            source_count=1,
            sources_ready=False,
        )

        self.assertTrue(abort)
        self.assertEqual(reason, "sources_not_ready")


if __name__ == "__main__":
    unittest.main()
